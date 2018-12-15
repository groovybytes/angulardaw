import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ProjectComponent} from "./project.component";
import {PluginListComponent} from "./plugin-list/plugin-list.component";
import {PluginPanelComponent} from "./plugin-panel/plugin-panel.component";
import {ProjectObserverComponent} from "./project-observer/project-observer.component";
import {ProjectsCreateComponent} from "./projects-create/projects-create.component";
import {RecorderComponent} from "./recorder/recorder.component";
import {TransportComponent} from "./transport/transport.component";
import {FormsModule} from "@angular/forms";
import {Ng5SliderModule} from "ng5-slider";
import {DawMatrixModule} from "../daw-matrix/daw-matrix.module";
import {SequencerModule} from "../sequencer/sequencer.module";
import {ApiModule} from "../api/api.module";
import {UiModule} from "../ui/ui.module";
import {SharedModule} from "../shared/shared.module";
import {CoreModule} from "../core/core.module";
import {Angular2DesktopModule} from "angular2-desktop";
import {RouterModule} from "@angular/router";
import {PluginWidgetComponent} from './plugin-widget/plugin-widget.component';
import {PadsComponent} from "./pads/pads.component";
import {PadsModule} from "./pads/pads.module";


@NgModule({
  declarations: [
    ProjectComponent,
    PluginListComponent,
    PluginPanelComponent,
    ProjectObserverComponent,
    ProjectsCreateComponent,
    RecorderComponent,
    TransportComponent,
    PluginWidgetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PadsModule,
    Ng5SliderModule,
    DawMatrixModule,
    SequencerModule,
    ApiModule,
    UiModule,
    SharedModule,
    RouterModule,
    CoreModule,
    Angular2DesktopModule
  ],
  providers: [

  ],
  entryComponents:[PadsComponent],
  exports: []
})
export class ProjectModule {
}

