import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WindowComponent} from "./window/window.component";
import {LayoutManagerService} from "./layout-manager.service";
import { DesktopComponent } from './desktop/desktop.component';
import { LayoutcontrolComponent } from './layoutcontrol/layoutcontrol.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers:[LayoutManagerService],
  declarations: [WindowComponent, DesktopComponent, LayoutcontrolComponent],
  exports:[WindowComponent,DesktopComponent]
})
export class DesktopModule { }
