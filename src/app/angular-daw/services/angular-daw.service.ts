import {EventEmitter, Injectable} from "@angular/core";
import {DawPlugin} from "../plugins/DawPlugin";
import {Sample} from "../model/Sample";
import {FileService} from "./file.service";
import {AudioContextService} from "./audiocontext.service";


@Injectable()
export class AngularDawService {

  config:any;
  plugins: Array<DawPlugin> = [];
  public pluginAdded: EventEmitter<DawPlugin> = new EventEmitter<DawPlugin>();

  instruments:{
    piano:Sample;
  }



  constructor(private fileService: FileService,private audioContext:AudioContextService) {
  }

  register(plugin: DawPlugin): void {
    this.plugins.push(plugin);
    this.pluginAdded.emit(plugin);
  }

  bootstrap():void{
    this.fileService.getFile("assets/daw.config.json").then(config=>{
      this.config = config;
    });

  }


}
