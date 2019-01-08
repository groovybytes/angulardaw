import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  declarations: [TransporttestComponent]
})
export class PrototypingModule { }
