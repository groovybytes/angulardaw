import {Component, Input, OnInit} from '@angular/core';
import {TransportService} from "../../services/transport.service";

@Component({
  selector: 'beatviewer',
  templateUrl: './beatviewer.component.html',
  styleUrls: ['./beatviewer.component.scss']
})
export class BeatviewerComponent implements OnInit {

  currentBeat: number = 0;
  transport: TransportService;

  constructor( transport: TransportService) {
    this.transport=transport;
  }

  ngOnInit() {
    this.transport.beat.subscribe(position => {
      this.currentBeat = position.beat;
    })
  }

  getUnits(): any {

    return new  Array(this.transport.signature.beatUnit).fill(0).map((x,i)=>i+1);

  }

}
