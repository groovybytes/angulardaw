import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'uic-button',
  templateUrl: './uic-button.component.html',
  styleUrls: ['./uic-button.component.scss']
})
export class UicButtonComponent implements OnInit {

  @HostBinding('class.block') @Input() block:boolean=false;
  @HostBinding('class') @Input() variant:string="primary";
  @Output() onClick:EventEmitter<void>=new EventEmitter();


 /* @HostListener('mouseover') onMouseOver() {
    let part = this.el.nativeElement.querySelector('.card-text');
    this.renderer.setElementStyle(part, 'display', 'block');
    this.ishovering = true; (2)
  }
  */

  constructor() { }

  ngOnInit() {
  }

}
