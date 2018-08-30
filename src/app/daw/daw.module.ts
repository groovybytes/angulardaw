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
import { TrackControlsComponent } from './track-controls/track-controls.component';
import {DawMatrixComponent} from "./daw-matrix/daw-matrix.component";
import { ProjectObserverComponent } from './project-observer/project-observer.component';
import { QuantizationComponent } from './quantization/quantization.component';
import { Sequencer2Component } from './sequencer2/sequencer2.component';
import {SequencerService2} from "./sequencer2/sequencer2.service";
import { Ng5SliderModule } from 'ng5-slider';

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
    Sequencer2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    UiModule,
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

