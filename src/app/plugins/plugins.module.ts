import {NgModule} from "@angular/core";
import {DrumsComponent} from "./drums/drums.component";
import {PadsComponent} from "./pads/pads.component";
import {PushComponent} from "./push/push.component";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
  declarations: [
    DrumsComponent,
    PadsComponent,
    PushComponent
  ],
  imports: [
    BrowserModule

  ],
  providers: [

  ],
  exports: [DrumsComponent,PadsComponent,PushComponent]
})
export class PluginsModule {
}

