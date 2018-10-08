import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {Sequencer2Component} from "./sequencer2.component";
import {SharedModule} from "../shared/shared.module";
import {Ng5SliderModule} from "ng5-slider";
import {SequencerService2} from "./sequencer2.service";
import {InterActionService} from "./interaction.service";
import {QuantizationComponent} from "./quantization/quantization.component";
import {UiModule} from "../ui/ui.module";


@NgModule({
  declarations: [

    Sequencer2Component,
    QuantizationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    UiModule,
    Ng5SliderModule
  ],
  providers: [
    SequencerService2,
    InterActionService
  ],
  exports: [Sequencer2Component]
})
export class SequencerModule {
}

