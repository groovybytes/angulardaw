import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PushComponent} from './push/push.component';
import {PushMatrixComponent} from './push-matrix/push-matrix.component';
import {TopControlsComponent} from './top-controls/top-controls.component';
import {Push} from "./model/Push";
import { DisplayComponent } from './display/display.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [{provide: "Push", useValue: new Push()}],
  declarations: [PushComponent, TopControlsComponent, PushMatrixComponent, DisplayComponent],
  exports: [PushComponent]
})
export class PushModule {
}
