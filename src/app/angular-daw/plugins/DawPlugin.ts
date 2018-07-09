import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {AngularDawService} from "../services/angular-daw.service";
import {WindowContent} from "../../angular-desktop/window/WindowContent";
import {OnInit} from "@angular/core";

export abstract class DawPlugin {

  constructor(protected dawService: AngularDawService) {

    /*    this.active = new BehaviorSubject<boolean>(false);
        this.active.subscribe(next => {
          console.log("next=" + next);
          if (next) this.activate();
          else this.destroy();
        })*/
  }

  /*active: BehaviorSubject<boolean>;*/

  abstract defaultWidth(): number;

  abstract defaultHeight(): number;

  abstract id(): string;

  abstract title(): string;

  abstract activate(): void;

  abstract destroy(): void;


}
