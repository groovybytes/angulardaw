import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MidiparserComponent } from './midiparser/midiparser.component';
import { TransporttestComponent } from './transporttest/transporttest.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MidiparserComponent, TransporttestComponent]
})
export class PrototypingModule { }
