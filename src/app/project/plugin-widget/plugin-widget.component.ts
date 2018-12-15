import {Component, Input, OnInit} from '@angular/core';
import {WstPlugin} from "../../model/daw/plugins/WstPlugin";
import {Project} from "../../model/daw/Project";
import {PadsComponent} from "../pads/pads.component";

@Component({
  selector: 'plugin-widget',
  templateUrl: './plugin-widget.component.html',
  styleUrls: ['./plugin-widget.component.scss']
})
export class PluginWidgetComponent implements OnInit {

  @Input() project: Project;
  @Input() plugin: WstPlugin;
  @Input() appId: string;

  attachedWindow:string;

  constructor() {
  }

  ngOnInit() {
  }

  initializeComponent(event:{component:PadsComponent,windowId:string}):void{
    event.component.columns = 3;
    event.component.rows = 3;
    event.component.project = this.project;
    event.component.plugin = this.plugin;
    event.component.pad = this.plugin.getInfo().pad;

    this.attachedWindow=event.windowId;
  }

}
