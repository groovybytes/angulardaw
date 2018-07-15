import {EventEmitter, Injectable} from "@angular/core";
import {DawPlugin} from "../plugins/DawPlugin";
import {FileService} from "./file.service";
import {SamplesV2Service} from "./samplesV2.service";
import {AppConfiguration} from "../../app.configuration";
import {Sample} from "../model/Sample";
import {TransportService} from "./transport.service";
import {MusicMath} from "../model/utils/MusicMath";


@Injectable()
export class AngularDawService {

 /* config:any;*/
  plugins: Array<DawPlugin> = [];
  public pluginAdded: EventEmitter<DawPlugin> = new EventEmitter<DawPlugin>();



  constructor(
    private fileService: FileService,
    private sampleService:SamplesV2Service,
    private transport:TransportService,
    private config:AppConfiguration) {
  }

  register(plugin: DawPlugin): void {
    this.plugins.push(plugin);
    this.pluginAdded.emit(plugin);
  }

  bootstrap():void{
    this.fileService.getFile("assets/daw.config.json").then(config=>{
      //this.config = config;
    });

  }



}


