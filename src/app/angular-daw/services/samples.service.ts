import {Injectable} from "@angular/core";
import {Sample} from "../model/Sample";
import {AudioContextService} from "./audiocontext.service";
import {FileService} from "./file.service";
import {InstrumentsContext} from "../model/InstrumentsContext";
import {Note} from "../model/theory/Note";
import {InstrumentsEnum} from "../model/InstrumentsEnum";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../../app.configuration";


@Injectable()
export class SamplesService {


  constructor(private audioContext: AudioContextService,
              private http: HttpClient,
              private config: AppConfiguration,
              private fileService: FileService) {

  }

  /*loadInstruments(instruments: Array<string>): Promise<InstrumentsContext> {
    let context = new InstrumentsContext();
    return new Promise((resolve, reject) => {
      let promises = [];
      instruments.forEach(instrument => {
        let promise = this.getSamples(["assets/sounds/instruments/" + instrument + "/1.wav"]);
        promise.then(result => {
          result[0].baseNote = "A3";
          context[instrument] = result[0];
        });
        promises.push(promise);

      })
      Promise.all(promises).then(() => resolve(context));
    })

  }*/

  getSamplesForInstrument(instrument: InstrumentsEnum): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.getUrl("sounds/instruments/" + instrument.toString() + "/1")).subscribe((results: Array<string>) => {
        this.getSamples(results.map(result => "assets/sounds/instruments/" + instrument.toString() + "/1/" + result)).then(results => {
          results.forEach(result=>{
            let parts = result.id.split("/");
            let sampleName = parts[parts.length-1].split(".")[0];
            result.baseNote=Note.get(sampleName[0].toUpperCase()+sampleName.substr(1,sampleName.length-1));
            if (result.baseNote===undefined) console.warn("couldnt find a basenote from sample name "+sampleName);
          })
          resolve(results);
        })
          .catch(error => reject(error));

      }, (error) => reject(error))
    })

  }

  public getSamples(urls: Array<string>): Promise<Array<Sample>> {
    return new Promise((resolve, reject) => {
      this.fileService.getFiles(urls).then(files => {
        let samples = [];
        Promise.all(files.map(file => this.getAudioBuffer(file))).then(buffers => {
          let i = 0;
          buffers.forEach(buffer => {
            samples.push(new Sample(urls[i], buffer, "", "", this.audioContext.context()));
            i++;
          });
          resolve(samples);
        })
      })
        .catch(error => reject(error))

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
