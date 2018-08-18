import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Project} from "../model/daw/Project";
import {NoteLength} from "../model/mip/NoteLength";
import {TransportService} from "../shared/services/transport.service";
import {PluginsService} from "../shared/services/plugins.service";
import {PluginId} from "../model/daw/plugins/PluginId";
import {System} from "../system/System";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  providers: [TransportService]
})

export class MetronomeComponent implements OnInit {

  @HostBinding('class')
  elementClass = 'plugin';

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  transport:TransportService;
  private project:Project;
  private transportSubscription: Subscription;

  constructor(
    transport:TransportService,
    private pluginsService:PluginsService,
    private system:System) {
    this.transport=transport;
  }

  onStartBtnToggled(value: boolean): void {
    if (this.transport.isRunning()) this.transport.stop();
    else this.transport.start();
  }

  pause(): void {
    this.transport.pause();
  }

  increase(value: number): void {
    /*let newBpm = this.transport.params.bpm.getValue() + value;
    if (newBpm >= this.minBpm && newBpm <= this.maxBpm) this.transport.params.bpm = newBpm;*/
  }

  activate(): void {

  }

  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  ngOnInit(): void {

    /*this.projectService.loadGhostProject({
      id:0,
      name:"metronome",
      bpm:120,
      quantization:NoteLength.Quarter,
      signature:"4,4"
    }).then(result=>this.projectViewModel=result);
    this.transport.params.quantization=NoteLength.EighthTriplet;
    let track = this.projectService.addTrack(this.projectViewModel,0);
    this.projectService.addPlugin(track,PluginId.METRONOME,0)
      .catch(error=>this.system.error(error))*/

  }


}
