import {Component, Input, OnInit} from '@angular/core';
import {TimeSignature} from "../../model/mip/TimeSignature";
import {MusicMath} from "../../model/utils/MusicMath";
import {Workstation} from "../../model/daw/Workstation";
import {Transport} from "../../model/daw/Transport";

@Component({
  selector: 'beatviewer',
  templateUrl: './beatviewer.component.html',
  styleUrls: ['./beatviewer.component.scss']
})
export class BeatviewerComponent implements OnInit {

  currentBeat: number = 0;

  @Input()  transport: Transport;
  @Input() signature: TimeSignature=new TimeSignature(4,4);

  constructor() {

  }

  ngOnInit() {
    this.transport.tickTock.subscribe(tick => {
      this.currentBeat = MusicMath.getBeatNumber(tick,this.signature);
    })
  }

  getUnits(): any {
    return new  Array(this.signature.beatUnit).fill(0).map((x,i)=>i+1);
  }

}
