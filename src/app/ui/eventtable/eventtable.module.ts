import {NgModule} from "@angular/core";
import {EventtableComponent} from "./eventtable.component";
import {EventrendererComponent} from "./eventrenderer/eventrenderer.component";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
  declarations: [
    EventtableComponent,
    EventrendererComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [


  ],
  exports:[
    EventtableComponent
  ]
})
export class EventtableModule {
}

