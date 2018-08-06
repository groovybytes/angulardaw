import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {SequencerComponent} from "./sequencer.component";
import {SequencerService} from "./sequencer.service";


@NgModule({
  declarations: [
    SequencerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    SequencerService

  ],
  exports:[SequencerComponent]
})
export class SequencerModule {
}

