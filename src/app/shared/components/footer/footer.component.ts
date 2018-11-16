import {Component, OnInit} from '@angular/core';
import {LayoutManagerService} from "../../services/layout-manager.service";
import {WindowSpecs} from "../../../model/daw/visual/desktop/WindowSpecs";
import {WindowState} from "../../../model/daw/visual/desktop/WindowState";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private layout:LayoutManagerService) { }

  ngOnInit() {
  }

  getMinimizedWindows():Array<WindowSpecs>{
    return this.layout.windows.filter(window=>window.state.getValue()===WindowState.MINIMIZED);
  }

}
