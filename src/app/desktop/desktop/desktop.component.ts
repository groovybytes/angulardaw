import {AfterContentInit, Component, ContentChildren, ElementRef, Input, OnInit, QueryList} from '@angular/core';
import {LayoutManagerService} from "../layout-manager.service";

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit,AfterContentInit {

  @ContentChildren('window')
  windows: QueryList<ElementRef>;


  constructor(private layoutManager:LayoutManagerService) { }

  ngOnInit() {
  }



  ngAfterContentInit(): void {
    console.log(this.windows);
  }

}
