import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {AngularDAWModule} from "./angular-daw/angular-daw.module";
import {AppConfiguration} from "./app.configuration";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SystemMonitorService} from "./system/system-monitor.service";
import { NotificationComponent } from './system/notification/notification.component';
import {System} from "./system/System";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularDAWModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    System,
    AppConfiguration,
    { provide: "lodash", useValue: window["_"] },
    { provide: "AudioContext", useValue: new AudioContext() },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SystemMonitorService,
      multi: true
    },
    {provide: ErrorHandler, useClass: SystemMonitorService}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

