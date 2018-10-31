import {Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WindowSpecs} from "../model/WindowSpecs";
import {WindowPosition} from "../model/WindowPosition";

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit,OnChanges {

  @Input() window:WindowSpecs;
  //@HostBinding("attr.data-position") position="left";
  @HostBinding("class.left") left:boolean=true;
  positionValues=WindowPosition;


  constructor() {

  }

  ngOnInit() {
  }


  close():void{
    //this.window.state=WindowState.CLOSED;
  }

  ngOnChanges(changes: SimpleChanges): void {

  }


}
