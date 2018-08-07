import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {BeatviewerComponent} from "./beatviewer/beatviewer.component";
import {SimplepianoComponent} from "./simplepiano/simplepiano.component";
import {RangesliderComponent} from "./rangeslider/rangeslider.component";
import {TransportComponent} from "./transport/transport.component";
import {PressButtonComponent} from "./press-button/press-button.component";
import {PanelComponent} from "./panel/panel.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {PatternComponent} from "./pattern/pattern.component";
import { InteractiveComponent } from './interactive/interactive.component';


@NgModule({
  declarations: [
    BeatviewerComponent,
    RangesliderComponent,
    SimplepianoComponent,
    PressButtonComponent,
    TransportComponent,
    PanelComponent,
    ToolbarComponent,
    PatternComponent,
    InteractiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [


  ],
  exports:[
    BeatviewerComponent,
    RangesliderComponent,
    SimplepianoComponent,
    PressButtonComponent,
    TransportComponent,
    PanelComponent,
    ToolbarComponent,
    PatternComponent,
    InteractiveComponent
  ]
})
export class UiModule {
}

