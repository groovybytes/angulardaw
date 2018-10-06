import {NgModule} from "@angular/core";
import {RegisterComponent} from "./register/register.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [


  ],
  exports: []
})
export class AuthenticationModule {
}

