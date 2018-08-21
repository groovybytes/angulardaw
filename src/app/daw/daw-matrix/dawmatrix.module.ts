import {NgModule} from "@angular/core";

import {BrowserModule} from "@angular/platform-browser";
import {DawMatrixService} from "./daw-matrix.service";
import {DawMatrixComponent} from "./daw-matrix.component";


@NgModule({
  declarations: [
    DawMatrixComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DawMatrixService

  ],
  exports:[
    DawMatrixComponent
  ]
})
export class DawmatrixModule {
}

