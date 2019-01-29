import {NgModule} from "@angular/core";
import {ConsoleComponent} from "./console.component";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    BrowserModule

  ],
  providers: [

  ],
  exports: [ConsoleComponent]
})
export class ConsoleModule {
}

