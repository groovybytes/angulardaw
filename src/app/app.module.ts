import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {AppConfiguration} from "./app.configuration";
import {HttpClientModule} from "@angular/common/http";
import {NotificationComponent} from './system/notification/notification.component';
import {System} from "./system/System";
import {MessagingService} from "./system/messaging.service";
import {DawModule} from "./daw/daw.module";
import {LandingPageComponent} from "./landing-page.component";
import {AuthenticationModule} from "./authentication/authentication.module";
import {AuthenticationService} from "./shared/authentication.service";

@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DawModule,
    AuthenticationModule
    //ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    System,
    AppConfiguration,
    MessagingService,
    AuthenticationService
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

