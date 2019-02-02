import {NgModule} from "@angular/core";
import {ConsoleComponent} from "./console.component";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {SharedModule} from "../shared/shared.module";
import {MatSliderModule} from "@angular/material";

@NgModule({
  declarations: [
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    MatSliderModule

  ],
  providers: [

  ],
  exports: [ConsoleComponent]
})
export class ConsoleModule {
}

