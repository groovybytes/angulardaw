import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DesktopComponent} from './desktop/desktop.component';
import {DesktopModule} from "../desktop/desktop.module";

@NgModule({
  imports: [
    CommonModule,
    DesktopModule
  ],
  declarations: [DesktopComponent]
})
export class TestModule { }
