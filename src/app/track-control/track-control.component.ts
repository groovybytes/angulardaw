import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";
import {System} from "../system/System";
import {PluginId} from "../model/daw/plugins/PluginId";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";

@Component({
  selector: 'daw-track-control',
  templateUrl: './track-control.component.html',
  styleUrls: ['./track-control.component.scss']
})
export class TrackControlComponent implements OnInit {

  @Input() track: Track;

  constructor(private system: System) {


  }

  selectInstrument(instr: string): void {
   /* if (instr === "") this.projectsService.removePlugin(this.track,0);
    else this.projectsService.addPlugin(this.track, PluginId[instr.toUpperCase()],0)
      .catch(error => this.system.error(error))*/

  }

  ngOnInit(): void {

  }

  setGain(value:number):void{
    this.track.gain.next(value);
  }


}
