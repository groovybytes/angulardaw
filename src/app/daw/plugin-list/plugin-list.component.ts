import { Component, OnInit } from '@angular/core';
import {PluginsService} from "../shared/services/plugins.service";
import {PluginInfo} from "../model/daw/plugins/PluginInfo";

@Component({
  selector: 'plugin-list',
  templateUrl: './plugin-list.component.html',
  styleUrls: ['./plugin-list.component.scss']
})
export class PluginListComponent implements OnInit {

  plugins:Array<PluginInfo>;

  constructor(private pluginService:PluginsService) { }

  ngOnInit() {
    this.plugins=this.pluginService.getPluginList();
  }

  dragStart(event:DragEvent,plugin:PluginInfo):void{
    event.dataTransfer.setData("text", JSON.stringify({command:'plugin',id:plugin.id}));
  }

}
