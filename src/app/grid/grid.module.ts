import {NgModule} from "@angular/core";
import {GridComponent} from "./grid.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule} from "@angular/forms";
import {GridComponentService} from "./grid.component.service";


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
    GridComponentService

  ],
  exports:[GridComponent]
})
export class GridModule {
}

