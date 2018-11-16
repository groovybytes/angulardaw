import {NgModule} from "@angular/core";
import {PluginsService} from "./services/plugins.service";
import {ProjectsService} from "./services/projects.service";
import {TracksService} from "./services/tracks.service";
import {MatrixService} from "./services/matrix.service";
import {PatternsService} from "./services/patterns.service";
import {KeyboardState} from "../model/KeyboardState";
import {AudioNodesService} from "./services/audionodes.service";
import {AudioContextService} from "./services/audiocontext.service";
import {Notes} from "../model/daw/Notes";
import {UiModule} from "../ui/ui.module";
import {LayoutManagerService} from "./services/layout-manager.service";
import {FooterComponent} from "./components/footer/footer.component";
import {CommonModule} from "@angular/common";
import {CardHeaderComponent} from "./components/card-header/card-header.component";


@NgModule({
  declarations: [FooterComponent,CardHeaderComponent],
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
    LayoutManagerService,
    {
      provide: "KeyboardState",
      useClass: KeyboardState
    },
    {
      provide: "Notes",
      useValue: new Notes()
    }
  ],
  exports: [FooterComponent,CardHeaderComponent]
})
export class SharedModule {
}

