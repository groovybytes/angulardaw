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
import { SequencerFooterComponent } from './sequencer-footer/sequencer-footer.component';
import { NotelengthComponent } from './notelength/notelength.component';
import {SequencerInteractionService} from "./sequencer.interaction.service";
import {MouseTrapEvents} from "./mousetrap/MouseTrapEvents";
import {MouseGesturesService} from "./mousetrap/mouse-gestures.service";


@NgModule({
  declarations: [

    SequencerComponent,
    QuantizationComponent,
    DragContainerComponent,
    EventTableComponent,
    SequencerFooterComponent,
    NotelengthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    UiModule,
    Ng5SliderModule
  ],
  providers: [
    SequencerService,
    MouseGesturesService,
    SequencerInteractionService,
    {
      provide: "MouseEvents",
      useValue: new MouseTrapEvents(),
      multi: false
    }
  ],
  exports: [SequencerComponent]
})
export class SequencerModule {
}

