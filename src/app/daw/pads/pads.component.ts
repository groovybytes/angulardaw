import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WstPlugin} from "../model/daw/WstPlugin";
import {NoteTrigger} from "../model/daw/NoteTrigger";

@Component({
  selector: 'pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss']
})
export class PadsComponent implements OnInit {

  @Input() plugin:WstPlugin;
  @Input() rows: number;
  @Input() columns: number;

  @Output() noteTriggered:EventEmitter<string>=new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  getRows(): Array<number> {
    return Array(this.rows).fill(0);
  }

  getColumns(): Array<number> {
    return Array(this.columns).fill(0);
  }

  trigger(note:string):void{
    this.plugin.feed(new NoteTrigger(null,note),0);
  }

}
