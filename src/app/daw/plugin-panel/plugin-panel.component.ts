import {Component, Input, OnInit} from '@angular/core';
import {WstPlugin} from "../model/daw/plugins/WstPlugin";
import {WindowState} from "../model/daw/visual/desktop/WindowState";

@Component({
  selector: 'plugin-panel',
  templateUrl: './plugin-panel.component.html',
  styleUrls: ['./plugin-panel.component.scss']
})
export class PluginPanelComponent implements OnInit {

  @Input() plugin:WstPlugin;

  constructor() { }

  ngOnInit() {
  }

  close():void{
    //this.plugin.windowSpecs.state=WindowState.CLOSED;
  }


}
