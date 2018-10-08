import {NgModule} from "@angular/core";
import {PluginsService} from "./services/plugins.service";
import {ProjectsService} from "./services/projects.service";
import {TracksService} from "./services/tracks.service";
import {MatrixService} from "./services/matrix.service";
import {PatternsService} from "./services/patterns.service";
import {KeyboardState} from "./model/KeyboardState";
import {AudioNodesService} from "./services/audionodes.service";
import {AudioContextService} from "./services/audiocontext.service";
import {Notes} from "./model/daw/Notes";


@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers: [
    PluginsService,
    ProjectsService,
    TracksService,
    MatrixService,
    PatternsService,
    AudioNodesService,
    AudioContextService,
    {
      provide: "KeyboardState",
      useClass: KeyboardState
    },
    {
      provide: "Notes",
      useValue: new Notes()
    }
  ],
  exports:[

  ]
})
export class SharedModule {
}

