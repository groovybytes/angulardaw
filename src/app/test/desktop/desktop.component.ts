import {Component, OnInit} from '@angular/core';
import {LayoutManagerService} from "../../desktop/layout-manager.service";

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {


  constructor(private layout:LayoutManagerService) { }

  ngOnInit() {
    this.layout.addWindow("window1",0);
    this.layout.addWindow("window2",1);
  /*  this.layout.addHeader();
    this.layout.addFooter();*/
    this.layout.applyLayout();
  }

}
