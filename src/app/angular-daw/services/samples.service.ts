import {Injectable} from "@angular/core";
import {Sample} from "../model/Sample";
import {AudioContextService} from "./audiocontext.service";
import {FileService} from "./file.service";
import {InstrumentsContext} from "../model/InstrumentsContext";
import {Note} from "../model/theory/Note";
import {InstrumentsEnum} from "../model/InstrumentsEnum";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../../app.configuration";
import {LoggingService} from "./logging.service";
import {SystemMonitorService} from "./system-monitor.service";

declare var Fuse;

@Injectable()
export class SamplesService {


  constructor(private audioContext: AudioContextService,
              private http: HttpClient,
              private monitor: SystemMonitorService,
              private config: AppConfiguration,
              private log: LoggingService,
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

  private reject(rejectionHandler, error): void {
    this.log.endGroup();
    rejectionHandler(error);
    this.monitor.httpError(error);
  }

  getSamplesForInstrument(instrument: InstrumentsEnum): Promise<Array<Sample>> {
    this.log.startGroup("retrieving samples for " + instrument);
    return new Promise((resolve, reject) => {
      this.http.get(this.config.getUrl("sounds/instruments/")).subscribe((results: Array<string>) => {
          var options = {
            keys: [{name: 'id'}],
            threshold: 0.2
          };
          var fuse = new Fuse(results.map(d => ({id: d})), options)
          let foundInstrumentName = fuse.search(instrument.toString())[0].id;
          this.log.log("info", "using instrument " + foundInstrumentName);

          this.http.get(this.config.getUrl("sounds/instruments/" + foundInstrumentName)).subscribe((results: Array<string>) => {
            this.log.startGroup("found " + results.length + " samples",true);
            this.getSamples(results.map(result => "assets/sounds/instruments/" + foundInstrumentName + "/" + result))
              .then(results => {
                results.forEach(result => {
                  this.log.log("info", "loading sample " + result.id);
                  try {
                    let parts = result.id.split("/");
                    let sampleName = parts[parts.length - 1].split(".")[0].toLowerCase();
                    sampleName = sampleName.replace("l-ra", "");
                    sampleName = sampleName.replace("l-r", "");
                    sampleName = sampleName.toUpperCase();
                    parts = sampleName.split(" ");
                    let noteName = parts[parts.length - 1].replace("#", "i");
                    result.baseNote = Note.get(noteName);
                    if (result.baseNote === undefined) throw new Error("couldnt find a basenote from sample name " + sampleName);
                    this.log.log("info", "success..");
                  } catch (e) {
                      this.reject(reject,e);
                  } finally {

                  }
                })
                this.log.endGroup();
                resolve(results);
              })
              .catch(error => {
                this.log.endGroup();
                this.reject(reject, error)
              });

          }, (error) => this.reject(reject, error))
        },
        (error) => this.reject(reject, error))
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
          .catch(error=>reject(error));
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
