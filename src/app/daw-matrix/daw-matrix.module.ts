import {NgModule} from "@angular/core";
import {DawMatrixComponent} from "./daw-matrix.component";
import {DawMatrixService} from "./daw-matrix.service";
import {HeaderCellMenuComponent} from "./header-cell-menu/header-cell-menu.component";
import {BodyCellMenuComponent} from "./body-cell-menu/body-cell-menu.component";
import {PluginDropdownComponent} from "./plugin-dropdown/plugin-dropdown.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {ConsoleModule} from "../console/console.module";
import {CoreModule} from "../core/core.module";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {Ng5SliderModule} from "ng5-slider";
import { ControlsComponent } from './controls/controls.component';
import {UiCoreModule} from "../ui-core/ui-core.module";


@NgModule({
  declarations: [
    DawMatrixComponent,
    HeaderCellMenuComponent,
    BodyCellMenuComponent,
    PluginDropdownComponent,
    ControlsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    UiCoreModule,
    ConsoleModule,
    CoreModule,
    SharedModule,
    RouterModule,
    Ng5SliderModule],
  providers: [
   DawMatrixService
  ],
  exports: [DawMatrixComponent]
})
export class DawMatrixModule {
}

