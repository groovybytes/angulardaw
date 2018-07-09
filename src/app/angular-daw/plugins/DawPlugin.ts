import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {AngularDawService} from "../services/angular-daw.service";
import {WindowContent} from "../../angular-desktop/window/WindowContent";
import {OnInit} from "@angular/core";

export abstract class DawPlugin implements WindowContent {

  constructor(protected dawService: AngularDawService) {
    this.dawService.register(this);
    this.active.subscribe(next => {
      if (next) this.activate();
      else this.destroy();
    })
  }

  active: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  abstract id(): string;

  abstract title(): string;

  abstract activate():void;

  abstract destroy():void;


}
