import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {SequencerComponent} from "./sequencer.component";
import {SequencerService} from "./sequencer.service";
import {SharedModule} from "../shared/shared.module";
import {UiModule} from "../ui/ui.module";


@NgModule({
  declarations: [
    SequencerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    UiModule
  ],
  providers: [
    SequencerService

  ],
  exports:[SequencerComponent]
})
export class SequencerModule {
}

