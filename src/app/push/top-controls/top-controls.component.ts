import {Component, Inject, OnInit} from '@angular/core';
import {Push} from "../model/Push";
import {PushMode} from "../model/PushMode";
import {PushService} from "../push.service";
import {ScaleId} from "../../model/mip/scales/ScaleId";

@Component({
  selector: 'push-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss']
})
export class TopControlsComponent implements OnInit {

  constructor(@Inject("Push") private push: Push, private pushService: PushService) {
  }

  ScaleId = ScaleId;


  ngOnInit() {
  }

  learnKeyClick(): void {
    if (this.push.mode === PushMode.DEFAULT) this.push.mode = PushMode.LEARN_KEY;
    else this.push.mode = PushMode.DEFAULT;
  }

  movePads(semitones: number): void {
    this.pushService.moveMatrix(semitones);
  }

  changeSize(columns: number, rows: number): void {
    this.pushService.changeSize(columns, rows);
  }

  setScale(id: ScaleId): void {
    this.push.settings.scale = id;
    this.pushService.setPadCollection(this.push.settings);
  }

}
