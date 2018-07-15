import {Component, Input, OnInit} from '@angular/core';
import {TransportService} from "../../services/transport.service";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {MusicMath} from "../../model/utils/MusicMath";

@Component({
  selector: 'beatviewer',
  templateUrl: './beatviewer.component.html',
  styleUrls: ['./beatviewer.component.scss']
})
export class BeatviewerComponent implements OnInit {

  currentBeat: number = 0;
  transport: TransportService;

  @Input() signature: TimeSignature=new TimeSignature(4,4);

  constructor( transport: TransportService) {
    this.transport=transport;
  }

  ngOnInit() {
    this.transport.tick.subscribe(position => {
      this.currentBeat = MusicMath.getBeatNumber(position.tick,this.signature);
    })
  }

  getUnits(): any {
    return new  Array(this.signature.beatUnit).fill(0).map((x,i)=>i+1);
  }

}
