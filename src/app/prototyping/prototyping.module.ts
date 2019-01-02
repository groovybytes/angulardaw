import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MidiparserComponent } from './midiparser/midiparser.component';
import { TransporttestComponent } from './transporttest/transporttest.component';
import {MonitorModule} from "../monitor/monitor.module";

@NgModule({
  imports: [
    CommonModule,
    MonitorModule
  ],
  declarations: [MidiparserComponent, TransporttestComponent]
})
export class PrototypingModule { }
