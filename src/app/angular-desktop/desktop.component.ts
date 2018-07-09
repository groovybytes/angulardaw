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
import {DawPlugin} from "../angular-daw/plugins/DawPlugin";
import {AngularDawService} from "../angular-daw/services/angular-daw.service";

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})

export class DesktopComponent implements OnInit, AfterContentInit {

  plugins:Array<DawPlugin>=[];
  @ContentChildren("window") windows: QueryList<WindowComponent>;

  activePlugins:Array<DawPlugin>=[];

  constructor(private dawService:AngularDawService) {
    this.dawService.pluginAdded.subscribe((plugin:DawPlugin)=>{
      plugin.activate();
      this.activePlugins.push(plugin);
      this.plugins.push(plugin)
    });
  }

  ngOnInit() {

    this.plugins.forEach(plugin=>{
      console.log(plugin);

    })
  }

  onShortcutClicked(view: {reference:ViewReference,windowContent:WindowContent}): void {

  }

  onTaskbarClick(view: {reference:ViewReference,windowContent:WindowContent}): void {

  }

  trackByFn(index, item:DawPlugin) {
    return item.id();
  }

  ngAfterContentInit(): void {


    this.windows.forEach((window: WindowComponent) => {
      window.y=50;
      window.x=200;
    })

    this.plugins.forEach(plugin=>{
      let window = this.windows.filter(window => window.content.id() === plugin.id())[0];
      window.state.next(WindowState.NORMAL);
      window.width=plugin.defaultWidth()+"px";
      window.height=plugin.defaultHeight()+"px";
    })


  }
}

