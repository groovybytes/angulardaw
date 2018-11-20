import {Component, Input, OnInit} from '@angular/core';
import {DesktopWindow} from "../../../model/daw/visual/desktop/WindowSpecs";
import {WindowState} from "../../../model/daw/visual/desktop/WindowState";
import {LayoutManagerService} from "../../services/layout-manager.service";

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit {

  @Input() window: DesktopWindow;


  state = WindowState;

  private readonly animationTimeout: number = 1000;

  constructor(private layout: LayoutManagerService) {
  }

  minimize(): void {
    this.window.clazz += " animated slideOutDown";
    this.layout.bringToFront(this.window.id);
    setTimeout(() => {
      this.window.state.next(WindowState.MINIMIZED);
      this.layout.bringToBack(this.window.id);
    }, this.animationTimeout)
  }

  restore(): void {
    this.window.state.next(WindowState.NORMAL);
  }

  maximize(): void {
    let state = this.window.state.getValue();
    this.window.state.next(WindowState.MAXIMIZED);

    if (state === WindowState.MINIMIZED) this.window.clazz += " animated slideInUp";


  }

  ngOnInit() {
  }

}
