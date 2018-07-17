import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MetronomeComponent} from "./plugins/metronome/metronome.component";
import {SysinfoComponent} from "./plugins/sysinfo/sysinfo.component";
import {SequencerComponent} from "./plugins/sequencer/sequencer.component";
import {BpmCircleComponent} from "./d3/bpm-circle/bpm-circle.component";
import {ClockComponent} from "./d3/clock/clock.component";
import {SliderComponent} from "./d3/slider/slider.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AngularDawComponent} from './angular-daw/angular-daw.component';
import {AngularDesktopModule} from "../angular-desktop/angular-desktop.module";
import {DevelopmentComponent} from './plugins/development/development.component';
import {InstrumentInfoApi} from "./api/instrumentinfo.api";
import {SamplesApi} from "./api/samples.api";
import {StartButtonDirective} from "./directives/start-button.directive";
import {PressButtonComponent} from './ui/press-button/press-button.component';
import {BeatviewerComponent} from "./ui/beatviewer/beatviewer.component";
import {PadComponent} from './plugins/pad/pad.component';
import {StepsequencerComponent} from './plugins/stepsequencer/stepsequencer.component';
import {DrumApi} from "./api/drum.api";
import {FilesApi} from "./api/files.api";


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularDesktopModule
  ],
  declarations: [
    BeatviewerComponent,
    MetronomeComponent,
    SequencerComponent,
    SysinfoComponent,
    BpmCircleComponent,
    ClockComponent,
    SliderComponent,
    AngularDawComponent,
    DevelopmentComponent,
    StartButtonDirective,
    PressButtonComponent,
    PadComponent,
    StepsequencerComponent
  ],
  exports:[
    AngularDawComponent
  ],
  providers:[
    InstrumentInfoApi,
    SamplesApi,
    FilesApi,
    DrumApi
  ]
})
export class AngularDAWModule { }
