import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorComponent } from './monitor/monitor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MonitorComponent],
  exports:[MonitorComponent]
})
export class MonitorModule { }
