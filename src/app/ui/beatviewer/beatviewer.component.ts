import {Component, Input, OnInit} from '@angular/core';
import {TimeSignature} from "../../model/mip/TimeSignature";
import {TransportService} from "../../shared/services/transport.service";

;

@Component({
  selector: 'beatviewer',
  templateUrl: './beatviewer.component.html',
  styleUrls: ['./beatviewer.component.scss']
})
export class BeatviewerComponent implements OnInit {

  currentBeat: number = 0;

  @Input()  transport: TransportService;
  @Input() signature: TimeSignature=new TimeSignature(4,4);

  constructor() {

  }

  ngOnInit() {
    this.transport.beat.subscribe(beat => {
      this.currentBeat = beat;
    })
  }

  getUnits(): any {
    return new  Array(this.signature.beatUnit).fill(0).map((x,i)=>i+1);
  }

}
