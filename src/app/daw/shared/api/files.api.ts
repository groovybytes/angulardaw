import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MidiFile} from "../../model/midi/midifilespec/MidiFile";
import {System} from "../../../system/System";

declare var MidiConvert: any;

@Injectable()
export class FilesApi {

  constructor(private http: HttpClient,private system:System) {

  }

  getFile(_url: string,convertToArrayBuffer?:boolean,timeout?:boolean): Promise<any> {

      return new Promise((resolve, reject) => {
        let run=()=>{
          let url = _url.replace("#","%23");
         // url=encodeURI(url);
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
                (error) => reject(this.system.httpError(error,url)))
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
