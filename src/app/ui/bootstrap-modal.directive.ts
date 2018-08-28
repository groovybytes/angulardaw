import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[bootstrap-modal]'
})
export class BootstrapModalDirective implements OnInit{

  constructor(private element:ElementRef) { }

  ngOnInit(): void {
    $(this.element.nativeElement)["modal"]({
      keyboard: false
    })
  }


}
