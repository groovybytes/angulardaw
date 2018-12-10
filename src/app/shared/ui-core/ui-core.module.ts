import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UicDropdownComponent } from './uic-dropdown/uic-dropdown.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UicDropdownComponent],
  exports: [UicDropdownComponent]
})
export class UiCoreModule { }
