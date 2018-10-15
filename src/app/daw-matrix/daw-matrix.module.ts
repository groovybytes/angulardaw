import {NgModule} from "@angular/core";
import {DawMatrixComponent} from "./daw-matrix.component";
import {DawMatrixService} from "./daw-matrix.service";
import {HeaderCellMenuComponent} from "./header-cell-menu/header-cell-menu.component";
import {BodyCellMenuComponent} from "./body-cell-menu/body-cell-menu.component";
import {PluginDropdownComponent} from "./plugin-dropdown/plugin-dropdown.component";
import {BrowserModule} from "@angular/platform-browser";
import {UiModule} from "../ui/ui.module";
import {AppRoutingModule} from "../app-routing.module";
import {ConsoleModule} from "../console/console.module";


@NgModule({
  declarations: [
    DawMatrixComponent,
    HeaderCellMenuComponent,
    BodyCellMenuComponent,
    PluginDropdownComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    UiModule,
    ConsoleModule
  ],
  providers: [
   DawMatrixService
  ],
  exports: [DawMatrixComponent]
})
export class DawMatrixModule {
}

