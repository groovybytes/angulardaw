import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushComponent } from './push/push.component';
import { PushMatrixComponent } from './push-matrix/push-matrix.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PushComponent, PushMatrixComponent],
  exports:[PushComponent]
})
export class PushModule { }
