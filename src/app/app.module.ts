import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {AngularDAWModule} from "./angular-daw/angular-daw.module";
import {AppConfiguration} from "./app.configuration";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularDAWModule

  ],
  providers: [
  AppConfiguration

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

