import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DesktopComponent} from "./desktop.component";
import {WindowComponent} from "./window/window.component";
import { DesktopButtonComponent } from './ui-components/desktop-button/desktop-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DesktopComponent,
    WindowComponent,
    DesktopButtonComponent
  ],
  exports:[
    DesktopComponent,
    WindowComponent,
    DesktopButtonComponent
  ]
})
export class AngularDesktopModule { }
