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
import {UiModule} from "../ui/ui.module";
import {CommonModule} from "@angular/common";
import {AppHistoryService} from "./services/app-history.service";
import {RouterService} from "./services/router.service";
import {ScaleId} from "../model/mip/scales/ScaleId";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UiModule
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
    RouterService,
    {
      provide: "KeyboardState",
      useClass: KeyboardState
    },
    {
      provide: "Notes",
      useValue: new Notes(ScaleId.CHROMATIC)
    }
  ],
  exports: []
})
export class SharedModule {
}

