import {Component, Input, OnInit} from '@angular/core';
import {LayoutManagerService} from "../../services/layout-manager.service";
import {DesktopWindow} from "../../../model/daw/visual/desktop/WindowSpecs";

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

  @Input() window: DesktopWindow;

  constructor(private layout: LayoutManagerService) {
  }

  ngOnInit() {
  }

}
