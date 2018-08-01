import {Inject, Injectable} from "@angular/core";
import {Sample} from "../model/daw/Sample";
import {NoteInfo} from "../model/utils/NoteInfo";
import {HttpClient} from "@angular/common/http";
import {InstrumentInfoApi} from "./instrumentinfo.api";
import {Buffers} from "../model/utils/Buffers";
import {FilesApi} from "./files.api";
import {System} from "../system/System";
import {AppConfiguration} from "../app.configuration";


@Injectable()
export class SamplesApi {


  constructor(@Inject("AudioContext") private audioContext: AudioContext,
              private http: HttpClient,
              private system: System,
              private config: AppConfiguration,
              private instrumentsInfoApi: InstrumentInfoApi,
              @Inject('lodash') private _: any,
              private fileService: FilesApi) {

  }


 /* createInstrument(name: string): Promise<Instrument> {

    return new Promise((resolve, reject) => {
      this.instrumentsInfoApi.getInfo(name).subscribe(instrumentInfo => {
        this.system.debug("instrument has " + instrumentInfo.samples.length + " samples");
        let provedSamples = [];
        this.getSamples(instrumentInfo.samples)
          .then(results => {
            results.forEach(result => {

              this.system.debug("loading sample " + result.id);
              try {
                let parts = result.id.split("/");
                let sampleName = parts[parts.length - 1].split(".")[0].toLowerCase();
                sampleName = sampleName.replace("l-ra", "");
                sampleName = sampleName.replace("l-r", "");
                sampleName = sampleName.toUpperCase();
                parts = sampleName.split(" ");
                let noteName = parts[parts.length - 1].replace("#", "i");
                if (this._.findIndex(provedSamples, sample => sample.baseNote.id === noteName) === -1) {
                  result.baseNote = NoteInfo.get(noteName);
                  if (result.baseNote === undefined) throw new Error("couldnt find a basenote from sample name " + sampleName);
                  provedSamples.push(result);
                  this.system.debug("success..");
                }
                else this.system.debug("skipped..");
              } catch (e) {

              }
            })
            let instrument = new Instrument();
            instrument.id = instrumentInfo.id;
            instrument.samples = provedSamples;
            resolve(instrument);
          })
          .catch(error => reject(error));
      }, error => reject(error));
    })
  }*/

  public getSamples(urls: Array<string>): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.fileService.getFiles(urls).then(files => {
        let samples = [];
        Promise.all(files.map(file => Buffers.getAudioBuffer(file, this.audioContext)))
          .then(buffers => {
            let i = 0;

            buffers.forEach((buffer: AudioBuffer) => {
              samples.push(new Sample(urls[i], buffer,  this.audioContext));
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
        .catch(error=>reject(error));
    })


  }


}
