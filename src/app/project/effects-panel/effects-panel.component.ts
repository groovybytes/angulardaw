import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../shared/model/daw/Project";
import {Track} from "../../shared/model/daw/Track";
import {PluginInfo} from "../../shared/model/daw/plugins/PluginInfo";


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
    this.project.desktop.openWindow(this.track.getInstrumentPlugin().getId());
  }

}
