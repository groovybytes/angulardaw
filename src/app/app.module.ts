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
import {LandingPageComponent} from "./landing-page.component";
import {AuthenticationModule} from "./authentication/authentication.module";
import {ProjectModule} from "./project/project.module";
import {CoreModule} from "./core/core.module";
import {Angular2DesktopModule} from "angular2-desktop";


@NgModule({
  declarations: [
    AppComponent,
    NotificationComponent,
    LandingPageComponent
  ],
  imports: [

    BrowserModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AuthenticationModule,
    ProjectModule,
    Angular2DesktopModule

  ],
  providers: [
    System,
    AppConfiguration,
    MessagingService
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

