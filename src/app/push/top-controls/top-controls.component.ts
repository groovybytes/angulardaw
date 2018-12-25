import {Component, Inject, OnInit} from '@angular/core';
import {Push} from "../model/Push";
import {PushMode} from "../model/PushMode";
import {PushService} from "../push.service";
import {ScaleId} from "../../model/mip/scales/ScaleId";
import {EventCategory} from "../../model/daw/devices/EventCategory";

@Component({
  selector: 'push-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss']
})
export class TopControlsComponent implements OnInit {

  push: Push;

  constructor(@Inject("Push")  push: Push, private pushService: PushService) {
    this.push = push;
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

  setSettings(id: string): void {
    let settings = this.push.settingsCollection.find(s => s.id === id);
    this.push.settings = settings;
    this.pushService.setPadCollection(this.push.settings);
  }

  toggleRecord(): void {
    this.push.publish(EventCategory.RECORD_TOGGLE, null);
  }

}
