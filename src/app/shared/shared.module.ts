import {NgModule} from "@angular/core";
import {PluginsService} from "./services/plugins.service";
import {ProjectsService} from "./services/projects.service";
import {TracksService} from "./services/tracks.service";
import {MatrixService} from "./services/matrix.service";
import {PatternsService} from "./services/patterns.service";
import {KeyboardState} from "../model/KeyboardState";
import {AudioNodesService} from "./services/audionodes.service";
import {AudioContextService} from "./services/audiocontext.service";
import {Notes} from "../model/mip/Notes";
import {CommonModule} from "@angular/common";
import {AppHistoryService} from "./services/app-history.service";
import {ScaleId} from "../model/mip/scales/ScaleId";
import {MakeMusicService} from "./services/make-music.service";
import {MidiBridgeService} from "./services/midi-bridge.service";
import {TransportService} from "./services/transport.service";
import {MatButtonModule, MatButtonToggleModule, MatIconModule} from "@angular/material";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  providers: [
    PluginsService,
    ProjectsService,
    TracksService,
    MatrixService,
    PatternsService,
    AudioNodesService,
    AudioContextService,
    AppHistoryService,
    MakeMusicService,
    TransportService,
    MidiBridgeService,
    {
      provide: "KeyboardState",
      useClass: KeyboardState
    },
    {
      provide: "Notes",
      useValue: new Notes(ScaleId.CHROMATIC)
    }
  ],
  exports: [MatButtonModule,MatIconModule,MatButtonToggleModule]
})
export class SharedModule {
}

