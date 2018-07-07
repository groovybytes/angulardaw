import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SystemMonitorService} from "./system-monitor.service";
import {MidiFile} from "../model/midi/midifilespec/MidiFile";

declare var MidiConvert: any;

@Injectable()
export class FileService {

  constructor(private http: HttpClient, private monitor: SystemMonitorService) {

  }

  getFile(_url: string,convertToArrayBuffer?:boolean,timeout?:boolean): Promise<any> {

      return new Promise((resolve, reject) => {
        let run=()=>{
          let url = _url.replace("#","%23");


          if (url.endsWith(".mid")) {
            MidiConvert.load(url, (midi: MidiFile) => {
              resolve(midi);
            })
          }
          else {
            let options={};
            if (url.endsWith(".json")) options={responseType:"json"};
            else options={responseType:"blob"};
            this.http.get(url, options)
              .subscribe((result: any) => {
                  if (convertToArrayBuffer) {
                    this.toArrayBuffer(result).then(buffer=>resolve(buffer));
                  }
                  else resolve(result);
                },
                (error) => {
                  console.log(error);
                  this.monitor.httpError(error);
                  reject(error);
                })
          }
        }
        if (timeout) setTimeout(()=>{
            run();
        })
        else run();
      })



  }

  getFiles(urls: Array<string>,convertToArrayBuffer?:boolean): Promise<Array<any>> {
    return Promise.all(urls.map(url => this.getFile(url,convertToArrayBuffer,true)));
  }

  toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsArrayBuffer(blob);
    });


  }
}
