import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UicDropdownComponent } from './uic-dropdown/uic-dropdown.component';
import {RouterModule} from "@angular/router";
import { UicButtonComponent } from './uic-button/uic-button.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [UicDropdownComponent, UicButtonComponent],
  exports: [UicDropdownComponent,UicButtonComponent]
})
export class UiCoreModule { }
