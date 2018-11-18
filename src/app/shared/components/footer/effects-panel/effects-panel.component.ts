import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../../model/daw/Project";
import {Track} from "../../../../model/daw/Track";
import {LayoutManagerService} from "../../../services/layout-manager.service";
import {PluginInfo} from "../../../../model/daw/plugins/PluginInfo";


@Component({
  selector: 'effects-panel',
  templateUrl: './effects-panel.component.html',
  styleUrls: ['./effects-panel.component.scss']
})
export class EffectsPanelComponent implements OnInit {

  @Input() project:Project;
  @Input() track:Track;

  constructor(private layout:LayoutManagerService) { }

  ngOnInit() {
  }

  getPluginInfo():PluginInfo{
    return this.track.getInstrumentPlugin().getInfo();
  }

  openPlugin():void{
    this.layout.openWindow(this.track.getInstrumentPlugin().getId());
  }

}
