import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Project} from "../../model//daw/Project";
import {Plugin} from "../../model//daw/plugins/Plugin";
import {WstPlugin} from "../../model//daw/plugins/WstPlugin";
import {NoteTrigger} from "../../model//daw/NoteTrigger";
import {DesktopWindow} from "../../desktop/model/DesktopWindow";
import {WindowState} from "../../desktop/model/WindowState";

@Component({
  selector: 'plugin-panel',
  templateUrl: './plugin-panel.component.html',
  styleUrls: ['./plugin-panel.component.scss']
})
export class PluginPanelComponent implements OnInit,OnChanges {

  @Input() project:Project;
  @Input() pluginId:string;
  @Input() window:DesktopWindow;

  private plugin:Plugin;

  constructor() { }

  ngOnInit() {
  }

  close():void{
    this.window.state.next(WindowState.CLOSED);
  }

  onNoteOutStart(event:{note:string}):void{
    let wstPlugin = this.plugin as WstPlugin;
    let trigger = new NoteTrigger(null,event.note);
    wstPlugin.feed(trigger,0);
    this.project.recordNoteStart.emit(trigger);
  }
  onNoteOutEnd():void{
    this.project.recordNoteEnd.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pluginId){
      this.plugin=this.project.getPlugin(changes.pluginId.currentValue);
    }
  }




}
