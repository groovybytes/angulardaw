import {Component, Input, OnInit} from '@angular/core';
import {WindowSpecs} from "../../../model/daw/visual/desktop/WindowSpecs";
import {WindowState} from "../../../model/daw/visual/desktop/WindowState";

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit {

  @Input() window:WindowSpecs;


  constructor() {
  }

  minimize(): void {
    this.window.state.next(WindowState.MINIMIZED);
  }

  maximize(): void {
    this.window.state.next(WindowState.MAXIMIZED);
  }

  ngOnInit() {
  }

}
