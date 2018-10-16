import {Component, ContentChildren, ElementRef, Input, OnInit, QueryList} from '@angular/core';
import {WindowSpecs} from "../../shared/model/daw/visual/desktop/WindowSpecs";

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  @ContentChildren("window") windowChildren:QueryList<ElementRef>;

  @Input() windows: Array<WindowSpecs>;

  constructor() { }

  ngOnInit() {
  }

}
