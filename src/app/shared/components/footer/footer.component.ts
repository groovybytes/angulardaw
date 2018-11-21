import {Component, Input, OnInit} from '@angular/core';
import {LayoutManagerService} from "../../../desktop/layout-manager.service";
import {WindowState} from "../../../desktop/model/WindowState";
import {Project} from "../../../model/daw/Project";
import {WindowInfo} from "../../../desktop/model/WindowInfo";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() project: Project;

  constructor(private layout: LayoutManagerService) {
  }

  ngOnInit() {
  }

  getMinimizedWindows(): Array<WindowInfo> {
    return this.layout.getWindows().filter(window => window.state === WindowState.MINIMIZED);
  }

}
