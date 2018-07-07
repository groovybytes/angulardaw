import {
  AfterContentInit,
  Component,
  ContentChildren,
  OnInit,
  QueryList
} from '@angular/core';
import {Taskbar} from "./model/Taskbar";
import {ViewReference} from "./model/ViewReference";
import {WindowComponent} from "./window/window.component";
import {WindowContent} from "./window/WindowContent";
import {windowCount} from "rxjs/operators";
import {WindowState} from "./window/WindowState";

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})

export class DesktopComponent implements OnInit, AfterContentInit {

  views: Array<{reference:ViewReference,windowContent:WindowContent}> = [];
  @ContentChildren("window") windows: QueryList<WindowComponent>;

  constructor() {

  }

  ngOnInit() {


  }

  getActiveReferences():Array<{reference:ViewReference,windowContent:WindowContent}>{
    return this.views.filter(view=>view.windowContent.active.getValue()===true);
  }
  onShortcutClicked(view: {reference:ViewReference,windowContent:WindowContent}): void {

    if (view.windowContent.active.getValue() === false) view.windowContent.active.next(true);
  }

  onTaskbarClick(view: {reference:ViewReference,windowContent:WindowContent}): void {

    this.windows.filter(window=>window.windowContent.id()===view.windowContent.id())[0].state.next(WindowState.NORMAL);
  }

  ngAfterContentInit(): void {

    let i = 0;
    this.windows.forEach((window: WindowComponent) => {
      window.y=200;
      window.x=(i)*400;
      window.windowContent.active.next(true);
      window.state.next(WindowState.MAXIMIZED);
      this.views.push({
        reference:new ViewReference(window.windowContent.id(), window.windowContent.title(), "", i),
        windowContent:window.windowContent
      });
      i++;

    })

  }
}

