import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {ViewReference} from "./model/ViewReference";
import {WindowComponent} from "./window/window.component";
import {WindowContent} from "./window/WindowContent";
import {WindowState} from "./window/WindowState";
import {DawPlugin} from "../angular-daw/plugins/DawPlugin";
import {Workstation} from "../angular-daw/model/daw/Workstation";

@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})

export class DesktopComponent implements OnInit, AfterContentInit,OnChanges {

  @Input() workstation: Workstation;

  plugins:Array<DawPlugin>=[];
  @ContentChildren("window") windows: QueryList<WindowComponent>;

  activePlugins:Array<DawPlugin>=[];

  constructor() {

  }

  ngOnInit() {

  }

  onShortcutClicked(view: {reference:ViewReference,windowContent:WindowContent}): void {

  }

  onTaskbarClick(view: {reference:ViewReference,windowContent:WindowContent}): void {

  }

  trackByFn(index, item:DawPlugin) {
    return item.id();
  }

  ngAfterContentInit(): void {

    this.plugins.forEach(plugin=>{
      let window = this.windows.filter(window => window.content.id() === plugin.id())[0];
      window.state.next(WindowState.NORMAL);
      window.width=plugin.defaultWidth()+"px";
      window.height=plugin.defaultHeight()+"px";
    })


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.workstation.pluginAdded.subscribe((plugin:DawPlugin)=>{
      plugin.activate();
      this.activePlugins.push(plugin);
      this.plugins.push(plugin)
    });
  }
}

