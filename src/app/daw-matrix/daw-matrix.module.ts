import {NgModule} from "@angular/core";
import {DawMatrixComponent} from "./daw-matrix.component";
import {DawMatrixService} from "./daw-matrix.service";
import {HeaderCellMenuComponent} from "./header-cell-menu/header-cell-menu.component";
import {BodyCellMenuComponent} from "./body-cell-menu/body-cell-menu.component";
import {PluginDropdownComponent} from "./plugin-dropdown/plugin-dropdown.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {UiModule} from "../ui/ui.module";
import {AppRoutingModule} from "../app-routing.module";


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
    UiModule

  ],
  providers: [
   DawMatrixService
  ],
  exports: [DawMatrixComponent]
})
export class DawMatrixModule {
}

