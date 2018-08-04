import {Component, Input, OnInit} from '@angular/core';
import {WorkstationService} from "../shared/services/workstation.service";

@Component({
  selector: 'pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.scss']
})
export class PadComponent   implements OnInit {

  @Input() workstation: WorkstationService;
  @Input() rows:number=5;
  @Input() columns:number=5;


  constructor() {

  }

  getRows():Array<number>{
    return new Array(this.rows);
  }
  getCols():Array<number>{
    return new Array(this.columns);
  }
  ngOnInit() {
  }

  activate(): void {
  }


  destroy(): void {
  }


}
