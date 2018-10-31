import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopComponent } from './desktop/desktop.component';
import { ExampleComponent } from './example/example.component';
import {WindowComponent} from "./window/window.component";
import {InteractDirective} from "./window/interact.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DesktopComponent, ExampleComponent,WindowComponent,InteractDirective],
  exports:[DesktopComponent,ExampleComponent]
})
export class Angular2DesktopModule { }
