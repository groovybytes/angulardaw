import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FilesApi} from "./files.api";
import {Sample} from "../../model/daw/Sample";
import {Buffers} from "../../model/utils/Buffers";
import {AbstractInstrumentSampler} from "../../model/daw/plugins/AbstractInstrumentSampler";
import {TheoryService} from "../services/theory.service";
import {System} from "../../../system/System";
import {AppConfiguration} from "../../../app.configuration";
import {AudioContextService} from "../services/audiocontext.service";


@Injectable()
export class SamplesApi {


  constructor(private audioContext: AudioContextService,
              private http: HttpClient,
              private system: System,
              private config: AppConfiguration,
              @Inject('lodash') private _: any,
              private theoryService:TheoryService,
              private fileService: FilesApi) {

  }


  getSamplesForInstrument(id: string): Promise<Array<Sample>> {

    return new Promise((resolve, reject) => {

      this.http.get(this.config.getAssetsUrl("instruments/" + id)).subscribe((result: Array<string>) => {
        let urls = result.map(d => this.config.getAssetsUrl("instruments/" + id + "/" + d));

        this.getSamples(urls).then(samples => resolve(samples))
          .catch(error => reject(error));

      }, error => reject(error));
    })
  }


  loadAllInstrumentSamples(instrumentName:string): Promise<{samples:Array<Sample>,baseNotes:Array<number>}> {
    return new Promise<{samples:Array<Sample>,baseNotes:Array<number>}>((resolve, reject) => {
      let provedSamples: Array<Sample> = [];
      this.getSamplesForInstrument(instrumentName)
        .then(results => {
          results.forEach(result => {
            try {

              let parts = result.id.split("/");
              let sampleName = parts[parts.length - 1].split(".")[0].toLowerCase();
              sampleName = sampleName.replace("l-ra", "");
              sampleName = sampleName.replace("l-r", "");
              sampleName = sampleName.toUpperCase();
              parts = sampleName.split(" ");
              let noteName = parts[parts.length - 1].replace("#", "i");
              if (provedSamples.findIndex(sample => sample.baseNote.id === noteName) === -1) {
                result.baseNote = this.theoryService.getNote(noteName);
                if (result.baseNote === undefined) throw new Error("couldnt find a basenote from sample name " + sampleName);
                provedSamples.push(result);
              }
            } catch (e) {
              console.log(e);
            }
          });

          resolve({samples:provedSamples,baseNotes:provedSamples.map(sample => sample.baseNote.index)});
        })
        .catch(error => reject(error));
    })
  }

  public getSamples(urls: Array<string>): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.fileService.getFiles(urls).then(files => {
        let samples = [];
        Promise.all(files.map(file => Buffers.getAudioBuffer(file, this.audioContext.getAudioContext())))
          .then(buffers => {
            let i = 0;

            buffers.forEach((buffer: AudioBuffer) => {
              samples.push(new Sample(urls[i], buffer, this.audioContext.getAudioContext()));
              i++;
            });
            resolve(samples);
          })
          .catch(error => reject(error));
      }).catch(error => reject(error))
    })

  }

  public getClickSamples(): Promise<{ defaultSample: Sample, accentSample: Sample }> {
    return new Promise((resolve, reject) => {
      this.getSamples([
        this.config.getAssetsUrl("sounds/metronome/click1.wav"),
        this.config.getAssetsUrl("sounds/metronome/click2.wav")])
        .then(result => {
          resolve({defaultSample: result[0], accentSample: result[1]});
        })
        .catch(error => reject(error));
    })


  }


}
