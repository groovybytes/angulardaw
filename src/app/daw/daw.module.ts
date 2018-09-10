import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ProjectsCreateComponent} from "./projects-create/projects-create.component";
import {ConsoleComponent} from "./console/console.component";
import {SharedModule} from "./shared/shared.module";
import {UiModule} from "../ui/ui.module";
import {ProjectComponent} from "./project/project.component";
import { SidebarModule } from 'ng-sidebar';
import { PluginListComponent } from './plugin-list/plugin-list.component';
import { EffectsPanelComponent } from './effects-panel/effects-panel.component';
import {TransportComponent} from "./transport/transport.component";
import {DawMatrixComponent} from "./daw-matrix/daw-matrix.component";
import { ProjectObserverComponent } from './project-observer/project-observer.component';
import { QuantizationComponent } from './quantization/quantization.component';
import { Sequencer2Component } from './sequencer2/sequencer2.component';
import {SequencerService2} from "./sequencer2/sequencer2.service";
import { Ng5SliderModule } from 'ng5-slider';
import { PluginDropdownComponent } from './plugin-dropdown/plugin-dropdown.component';
import {AppRoutingModule} from "../app-routing.module";
import { BodyCellMenuComponent } from './daw-matrix/body-cell-menu/body-cell-menu.component';
import { HeaderCellMenuComponent } from './daw-matrix/header-cell-menu/header-cell-menu.component';
import {TrackControlsComponent} from "./console/track-controls/track-controls.component";
import {DrumsComponent} from "./plugins/drums/drums.component";
import { PushComponent } from './push/push.component';
import { PadsComponent } from './plugins/pads/pads.component';
import { PluginPanelComponent } from './plugin-panel/plugin-panel.component';
import { RecorderComponent } from './recorder/recorder.component';

let audioContext = new AudioContext();

@NgModule({
  declarations: [
    ProjectsCreateComponent,
    ProjectComponent,
    ConsoleComponent,
    PluginListComponent,
    EffectsPanelComponent,
    TransportComponent,
    TrackControlsComponent,
    DawMatrixComponent,
    ProjectObserverComponent,
    QuantizationComponent,
    Sequencer2Component,
    PluginDropdownComponent,
    BodyCellMenuComponent,
    HeaderCellMenuComponent,
    DrumsComponent,
    PushComponent,
    PadsComponent,
    PluginPanelComponent,
    RecorderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    UiModule,
    AppRoutingModule,
    SidebarModule.forRoot(),
    Ng5SliderModule
  ],
  providers: [
    {provide: "lodash", useValue: window["_"]},
    {provide: "AudioContext", useValue: audioContext},
    SequencerService2

  ],
  exports: []
})
export class DawModule {
}

