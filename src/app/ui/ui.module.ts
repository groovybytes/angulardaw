import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {RangesliderComponent} from "./rangeslider/rangeslider.component";
import {PressButtonComponent} from "./press-button/press-button.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {TestsComponent} from "./tests/tests.component";
import {BootstrapModalDirective} from "./bootstrap-modal.directive";
import { ColorpickerComponent } from './colorpicker/colorpicker.component';



@NgModule({
  declarations: [
    RangesliderComponent,
    PressButtonComponent,
    ToolbarComponent,
    TestsComponent,
    BootstrapModalDirective,
    ColorpickerComponent
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
    ToolbarComponent,
    BootstrapModalDirective,
    ColorpickerComponent

  ]
})
export class UiModule {
}

