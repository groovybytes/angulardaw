import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {Ng5SliderModule} from "ng5-slider";
import {QuantizationComponent} from "./quantization/quantization.component";
import {UiModule} from "../ui/ui.module";
import {DragContainerComponent} from "./drag-container/drag-container.component";
import {SequencerComponent} from "./sequencer.component";
import {EventTableComponent} from "./event-table/event-table.component";
import {SequencerService} from "./sequencer.service";
import {DragContainerService} from "./drag-container/drag-container.service";


@NgModule({
  declarations: [

    SequencerComponent,
    QuantizationComponent,
    DragContainerComponent,
    EventTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    UiModule,
    Ng5SliderModule
  ],
  providers: [
    SequencerService,DragContainerService
  ],
  exports: [SequencerComponent]
})
export class SequencerModule {
}

