import {NgModule} from "@angular/core";
import {ConsoleComponent} from "./console.component";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {SharedModule} from "../shared/shared.module";
import {UiCoreModule} from "../ui-core/ui-core.module";

@NgModule({
  declarations: [
    ConsoleComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    UiCoreModule

  ],
  providers: [

  ],
  exports: [ConsoleComponent]
})
export class ConsoleModule {
}

