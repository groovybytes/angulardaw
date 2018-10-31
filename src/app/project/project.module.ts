import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ProjectComponent} from "./project.component";
import {EffectsPanelComponent} from "./effects-panel/effects-panel.component";
import {PluginListComponent} from "./plugin-list/plugin-list.component";
import {PluginPanelComponent} from "./plugin-panel/plugin-panel.component";
import {ProjectObserverComponent} from "./project-observer/project-observer.component";
import {ProjectsCreateComponent} from "./projects-create/projects-create.component";
import {RecorderComponent} from "./recorder/recorder.component";
import {TransportComponent} from "./transport/transport.component";
import {FormsModule} from "@angular/forms";
import {PluginsModule} from "../plugins/plugins.module";
import {Ng5SliderModule} from "ng5-slider";
import {DawMatrixModule} from "../daw-matrix/daw-matrix.module";
import {SequencerModule} from "../sequencer/sequencer.module";
import {ApiModule} from "../api/api.module";
import {UiModule} from "../ui/ui.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    ProjectComponent,
    EffectsPanelComponent,
    PluginListComponent,
    PluginPanelComponent,
    ProjectObserverComponent,
    ProjectsCreateComponent,
    RecorderComponent,
    TransportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PluginsModule,
    Ng5SliderModule,
    DawMatrixModule,
    SequencerModule,
    ApiModule,
    UiModule,
    SharedModule


  ],
  providers: [

  ],
  exports: []
})
export class ProjectModule {
}

