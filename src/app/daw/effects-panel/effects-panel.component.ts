import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../model/daw/Track";
import {PluginInfo} from "../model/daw/plugins/PluginInfo";
import {Project} from "../model/daw/Project";
import {WindowState} from "../model/daw/visual/desktop/WindowState";

@Component({
  selector: 'effects-panel',
  templateUrl: './effects-panel.component.html',
  styleUrls: ['./effects-panel.component.scss']
})
export class EffectsPanelComponent implements OnInit {

  @Input() project:Project;
  @Input() track:Track;

  constructor() { }

  ngOnInit() {
  }

  getPluginInfo():PluginInfo{
    return this.track.getInstrumentPlugin().getInfo();
  }

  openPlugin():void{
    this.project.desktop.openPluginWindow(this.track.getInstrumentPlugin().getId());
  }

}
