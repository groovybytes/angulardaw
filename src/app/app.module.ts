import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {AppConfiguration} from "./app.configuration";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SystemMonitorService} from "./system/system-monitor.service";
import {NotificationComponent} from './system/notification/notification.component';
import {System} from "./system/System";
import {BeatviewerComponent} from "./ui/beatviewer/beatviewer.component";
import {SequencerComponent} from "./sequencer/sequencer.component";
import {MetronomeComponent} from "./metronome/metronome.component";
import {BpmCircleComponent} from "./d3/bpm-circle/bpm-circle.component";
import {ClockComponent} from "./d3/clock/clock.component";
import {SliderComponent} from "./d3/slider/slider.component";
import {DevelopmentComponent} from "./development/development.component";
import {PressButtonComponent} from "./ui/press-button/press-button.component";
import {PadComponent} from "./pad/pad.component";
import {StepsequencerComponent} from "./stepsequencer/stepsequencer.component";
import {DrumApi} from "./api/drum.api";
import {FilesApi} from "./api/files.api";
import {SamplesApi} from "./api/samples.api";
import {InstrumentInfoApi} from "./api/instrumentinfo.api";
import {Workstation} from "./model/daw/Workstation";
import {TransportComponent} from './ui/transport/transport.component';
import {ToolbarComponent} from './ui/toolbar/toolbar.component';
import {DawControlComponent} from './daw-control/daw-control.component';
import {PanelComponent} from './ui/panel/panel.component';
import { StorageServiceModule} from 'angular-webstorage-service';
import { RangesliderComponent } from './ui/rangeslider/rangeslider.component';


let audioContext = new AudioContext();
@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    BeatviewerComponent,
    MetronomeComponent,
    SequencerComponent,
    BpmCircleComponent,
    ClockComponent,
    SliderComponent,
    DevelopmentComponent,
    PressButtonComponent,
    PadComponent,
    StepsequencerComponent,
    TransportComponent,
    ToolbarComponent,
    DawControlComponent,
    PanelComponent,
    RangesliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StorageServiceModule
    //ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    InstrumentInfoApi,
    SamplesApi,
    FilesApi,
    DrumApi,
    System,
    AppConfiguration,
    { provide: "interact", useValue: window["interact"] },
    { provide: "lodash", useValue: window["_"] },
    { provide: "AudioContext", useValue: audioContext },
    { provide: "workstation", useValue: new Workstation(audioContext) },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SystemMonitorService,
      multi: true
    }
   /* {provide: ErrorHandler, useClass: SystemMonitorService}*/

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

