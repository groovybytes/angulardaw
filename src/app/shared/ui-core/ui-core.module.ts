import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UicDropdownComponent } from './uic-dropdown/uic-dropdown.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [UicDropdownComponent],
  exports: [UicDropdownComponent]
})
export class UiCoreModule { }
