import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {PadsComponent} from "./pads.component";


@NgModule({
  declarations: [
    PadsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [

  ],
  exports: [PadsComponent]
})
export class PadsModule {
}

