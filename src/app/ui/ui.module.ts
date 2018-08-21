import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {RangesliderComponent} from "./rangeslider/rangeslider.component";
import {TransportComponent} from "./transport/transport.component";
import {PressButtonComponent} from "./press-button/press-button.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {TestsComponent} from "./tests/tests.component";



@NgModule({
  declarations: [
    RangesliderComponent,
    PressButtonComponent,
    TransportComponent,
    ToolbarComponent,
    TestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [


  ],
  exports:[
    RangesliderComponent,
    PressButtonComponent,
    TransportComponent,
    ToolbarComponent

  ]
})
export class UiModule {
}

