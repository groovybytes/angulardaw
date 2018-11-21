import {Component, Input, OnInit} from '@angular/core';
import {WindowState} from "../../../desktop/model/WindowState";
import {LayoutManagerService} from "../../../desktop/layout-manager.service";
import {WindowInfo} from "../../../desktop/model/WindowInfo";

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit {

  @Input() window: WindowInfo;


  state = WindowState;


  constructor(private layout: LayoutManagerService) {
  }

  minimize(): void {
    this.layout.minimize(this.window.id);
  }

  restore(): void {
    this.layout.openWindow(this.window.id);
  }

  maximize(): void {
    this.layout.maximize(this.window.id);
  }

  ngOnInit() {
  }

}
