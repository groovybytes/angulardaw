import {Component, OnInit} from '@angular/core';
import {DesktopManager} from "../model/DesktopManager";
import {WindowSpecs} from "../model/WindowSpecs";
import {WindowPosition} from "../model/WindowPosition";
import {WindowState} from "../model/WindowState";

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  desktop:DesktopManager;
  window1:WindowSpecs;

  constructor() { }

  ngOnInit() {
    this.desktop=new DesktopManager();
    this.desktop.addWindow("window1");

    this.window1=new WindowSpecs();
    this.window1.position=WindowPosition.LEFT;
    this.window1.x=100;
    this.window1.y=50;
    this.window1.state=WindowState.OPENED;
    this.window1.width=400;
    this.window1.height=400;

  }

}
