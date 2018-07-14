import {Inject, Injectable} from "@angular/core";
import {Sample} from "../model/Sample";
import {AudioContextService} from "./audiocontext.service";
import {FileService} from "./file.service";
import {NoteInfo} from "../model/utils/NoteInfo";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../../app.configuration";
import {Instrument} from "../model/Instrument";
import {InstrumentInfoApi} from "../api/instrumentinfo.api";
import {System} from "../../system/System";

declare var Fuse;

@Injectable()
export class SamplesV2Service {


  constructor(private audioContext: AudioContextService,
              private http: HttpClient,
              private system: System,
              private config: AppConfiguration,
              private instrumentsInfoApi: InstrumentInfoApi,
              @Inject('lodash') private _:any,
              private fileService: FileService) {

  }


  createInstrument(name: string): Promise<Instrument> {

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
                if (this._.findIndex(provedSamples,sample=>sample.baseNote.id===noteName)===-1){
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
  }

  public getSamples(urls: Array<string>): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.fileService.getFiles(urls).then(files => {
        let samples = [];
        Promise.all(files.map(file => this.getAudioBuffer(file)))
          .then(buffers => {
            let i = 0;

            buffers.forEach(buffer => {
              samples.push(new Sample(urls[i], buffer, "", "", this.audioContext.context()));
              i++;
            });
            resolve(samples);
          })
          .catch(error => reject(error));
      }).catch(error => reject(error))
    })

  }

  private getAudioBuffer(blob: Blob): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      this.convertToArrayBuffer(blob).then(result => {
        this.audioContext.context().decodeAudioData(result, (buffer) => {
          resolve(buffer);
        })
      })
    });


  }

  private convertToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {

    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsArrayBuffer(blob);
    });


  }

}
