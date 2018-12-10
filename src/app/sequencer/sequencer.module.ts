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
import {CoreModule} from "../core/core.module";
import {A2dClientService, Angular2DesktopModule} from "angular2-desktop";


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
    Ng5SliderModule,
    CoreModule,
    Angular2DesktopModule
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
  exports: [SequencerComponent,SequencerFooterComponent]
})
export class SequencerModule {
}

