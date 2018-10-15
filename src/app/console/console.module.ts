import {NgModule} from "@angular/core";
import {ConsoleComponent} from "./console.component";
import {UiModule} from "../ui/ui.module";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    BrowserModule

  ],
  providers: [

  ],
  exports: [ConsoleComponent]
})
export class ConsoleModule {
}

