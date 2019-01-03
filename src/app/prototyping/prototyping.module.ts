import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MidiparserComponent } from './midiparser/midiparser.component';
import { TransporttestComponent } from './transporttest/transporttest.component';
import {MonitorModule} from "../monitor/monitor.module";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MonitorModule
  ],
  declarations: [MidiparserComponent, TransporttestComponent]
})
export class PrototypingModule { }
