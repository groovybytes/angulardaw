import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FilesApi} from "./files.api";
import {System} from "../../system/System";
import {AppConfiguration} from "../../app.configuration";
import {Sample} from "../../model/daw/Sample";
import {Buffers} from "../../model/utils/Buffers";


@Injectable()
export class SamplesApi {


  constructor(@Inject("AudioContext") private audioContext: AudioContext,
              private http: HttpClient,
              private system: System,
              private config: AppConfiguration,
              @Inject('lodash') private _: any,
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

  public getSamples(urls: Array<string>): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.fileService.getFiles(urls).then(files => {
        let samples = [];
        Promise.all(files.map(file => Buffers.getAudioBuffer(file, this.audioContext)))
          .then(buffers => {
            let i = 0;

            buffers.forEach((buffer: AudioBuffer) => {
              samples.push(new Sample(urls[i], buffer, this.audioContext));
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
