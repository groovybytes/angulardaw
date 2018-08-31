import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {RangesliderComponent} from "./rangeslider/rangeslider.component";
import {PressButtonComponent} from "./press-button/press-button.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {TestsComponent} from "./tests/tests.component";
import {BootstrapModalDirective} from "./bootstrap-modal.directive";
import {DawMatrixService} from "../daw/daw-matrix/daw-matrix.service";
import {InteractDirective} from "./directives/interact.directive";
import {ResizableDirective} from "./directives/resizable.directive";
import {DraggableDirective} from "./directives/draggable.directive";
import {JqueryDraggableDirective} from "./directives/jquery.draggable.directive";



@NgModule({
  declarations: [
    RangesliderComponent,
    PressButtonComponent,
    ToolbarComponent,
    TestsComponent,
    BootstrapModalDirective,
    InteractDirective,
    ResizableDirective,
    DraggableDirective,
    JqueryDraggableDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    DawMatrixService

  ],
  exports:[
    RangesliderComponent,
    PressButtonComponent,
    ToolbarComponent,
    BootstrapModalDirective,
    InteractDirective,
    ResizableDirective,
    JqueryDraggableDirective

  ]
})
export class UiModule {
}

