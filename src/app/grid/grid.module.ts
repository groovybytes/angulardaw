import {NgModule} from "@angular/core";
import {GridComponent} from "./grid.component";
import {GridService} from "./grid.service";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    GridComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    GridService

  ],
  exports:[GridComponent]
})
export class GridModule {
}

