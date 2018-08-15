import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {AppConfiguration} from "./app.configuration";
import {HttpClientModule} from "@angular/common/http";
import {NotificationComponent} from './system/notification/notification.component';
import {System} from "./system/System";
import {MetronomeComponent} from "./metronome/metronome.component";
import {DrumApi} from "./api/drum.api";
import {FilesApi} from "./api/files.api";
import {SamplesApi} from "./api/samples.api";
import {InstrumentInfoApi} from "./api/instrumentinfo.api";
import {DawControlComponent} from './daw-control/daw-control.component';
import {StorageServiceModule} from 'angular-webstorage-service';
import {SharedModule} from "./shared/shared.module";
import {AuthService} from "./shared/services/auth.service";
import {MainPageComponent} from './main-page/main-page.component';
import {ProjectsPageComponent} from './projects-page/projects-page.component';
import {TrackComponent} from './track/track.component';
import {MessagingService} from "./system/messaging.service";
import {TransportService} from "./shared/services/transport.service";
import {TrackControlComponent} from './track-control/track-control.component';
import {GridModule} from "./grid/grid.module";
import {SequencerModule} from "./sequencer/sequencer.module";
import {UiModule} from "./ui/ui.module";
import { DawGridComponent } from './daw-grid/daw-grid.component';
import {DawGridService} from "./daw-grid/daw-grid.service";
import {ObserversModule} from "./modelobserver/observers.module";

let audioContext = new AudioContext();
@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    MetronomeComponent,
    DawControlComponent,
    MainPageComponent,
    ProjectsPageComponent,
    TrackComponent,
    TrackControlComponent,
    DawGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StorageServiceModule,
    SharedModule,
    GridModule,
    SequencerModule,
    UiModule,
    ObserversModule
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
    DawGridService,
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

