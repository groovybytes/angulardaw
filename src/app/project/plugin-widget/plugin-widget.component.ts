import {Component, Input, OnInit} from '@angular/core';
import {WstPlugin} from "../../model/daw/plugins/WstPlugin";
import {A2dClientService, WindowParams} from "angular2-desktop";
import {Project} from "../../model/daw/Project";

@Component({
  selector: 'plugin-widget',
  templateUrl: './plugin-widget.component.html',
  styleUrls: ['./plugin-widget.component.scss']
})
export class PluginWidgetComponent implements OnInit {

  @Input() project:Project;
  @Input() plugin:WstPlugin;
  @Input() appId:string;

  constructor(private desktop:A2dClientService) { }

  ngOnInit() {
  }

  open():void{
     let params = new WindowParams(
       null,
       100,
       100,
       200,
       200,
       {project:this.project},null
     );


     let windowId = this.desktop.createWindow("pads",params);
     this.desktop.openWindow(windowId);
  }

}
