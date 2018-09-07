import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../model/daw/Track";
import {PluginInfo} from "../model/daw/plugins/PluginInfo";
import {Project} from "../model/daw/Project";

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
    return this.track&&this.track.plugin?this.project.plugins.find(p=>p.id===this.track.plugin.getId()):null;
  }

}
