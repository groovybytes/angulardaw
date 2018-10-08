import {Component, Input, OnInit} from '@angular/core';
import {PluginInfo} from "../../shared/model/daw/plugins/PluginInfo";


@Component({
  selector: 'plugin-list',
  templateUrl: './plugin-list.component.html',
  styleUrls: ['./plugin-list.component.scss']
})
export class PluginListComponent implements OnInit {

  @Input() plugins:Array<PluginInfo>;

  constructor() { }

  ngOnInit() {

  }

  dragStart(event:DragEvent,plugin:PluginInfo):void{
    event.dataTransfer.setData("text", JSON.stringify({command:'plugin',id:plugin.id}));
  }

}
