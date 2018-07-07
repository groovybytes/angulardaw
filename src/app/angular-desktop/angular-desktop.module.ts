import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DesktopComponent} from "./desktop.component";
import {WindowComponent} from "./window/window.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DesktopComponent,
    WindowComponent
  ],
  exports:[
    DesktopComponent,
    WindowComponent
  ]
})
export class AngularDesktopModule { }
