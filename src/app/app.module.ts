import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {AppConfiguration} from "./app.configuration";
import {HttpClientModule} from "@angular/common/http";
import {NotificationComponent} from './system/notification/notification.component';
import {System} from "./system/System";
import {BeatviewerComponent} from "./ui/beatviewer/beatviewer.component";
import {MetronomeComponent} from "./metronome/metronome.component";
import {BpmCircleComponent} from "./d3/bpm-circle/bpm-circle.component";
import {ClockComponent} from "./d3/clock/clock.component";
import {SliderComponent} from "./d3/slider/slider.component";
import {DevelopmentComponent} from "./development/development.component";
import {PressButtonComponent} from "./ui/press-button/press-button.component";
import {StepsequencerComponent} from "./stepsequencer/stepsequencer.component";
import {DrumApi} from "./api/drum.api";
import {FilesApi} from "./api/files.api";
import {SamplesApi} from "./api/samples.api";
import {InstrumentInfoApi} from "./api/instrumentinfo.api";
import {TransportComponent} from './ui/transport/transport.component';
import {ToolbarComponent} from './ui/toolbar/toolbar.component';
import {DawControlComponent} from './daw-control/daw-control.component';
import {PanelComponent} from './ui/panel/panel.component';
import {StorageServiceModule} from 'angular-webstorage-service';
import {RangesliderComponent} from './ui/rangeslider/rangeslider.component';
import {SharedModule} from "./shared/shared.module";
import {SimplepianoComponent} from './ui/simplepiano/simplepiano.component';
import {AuthService} from "./shared/services/auth.service";
import {MainPageComponent} from './main-page/main-page.component';
import {ProjectsPageComponent} from './projects-page/projects-page.component';
import {TrackComponent} from './track/track.component';
import {MessagingService} from "./system/messaging.service";
import {TransportService} from "./shared/services/transport.service";
import { TrackControlComponent } from './track-control/track-control.component';


let audioContext = new AudioContext();
@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    BeatviewerComponent,
    MetronomeComponent,
    BpmCircleComponent,
    ClockComponent,
    SliderComponent,
    DevelopmentComponent,
    PressButtonComponent,
    StepsequencerComponent,
    TransportComponent,
    ToolbarComponent,
    DawControlComponent,
    PanelComponent,
    RangesliderComponent,
    SimplepianoComponent,
    MainPageComponent,
    ProjectsPageComponent,
    TrackComponent,
    TrackControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StorageServiceModule,
    SharedModule
    //ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    InstrumentInfoApi,
    SamplesApi,
    FilesApi,
    DrumApi,
    System,
    AppConfiguration,
    AuthService,
    TransportService,
    MessagingService,
    TransportService,
    { provide: "interact", useValue: window["interact"] },
    { provide: "lodash", useValue: window["_"] },
    { provide: "AudioContext", useValue: audioContext }
   /* {
      provide: HTTP_INTERCEPTORS,
      useClass: SystemMonitorService,
      multi: true
    }*/
   /* {provide: ErrorHandler, useClass: SystemMonitorService}*/

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

