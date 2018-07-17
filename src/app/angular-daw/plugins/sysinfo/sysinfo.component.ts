import {Component, ElementRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {Workstation} from "../../model/daw/Workstation";

@Component({
  selector: 'sysinfo',
  templateUrl: './sysinfo.component.html',
  styleUrls: ['./sysinfo.component.scss']
})
export class SysinfoComponent  extends DawPlugin implements OnInit, OnDestroy {

  @Input() workstation: Workstation;

  @HostBinding('class')
  elementClass = 'plugin';

  plugins: Array<DawPlugin> = [];
  activated: boolean = false;

  constructor(protected element: ElementRef) {
    super();

  }

  ngOnInit() {
    this.workstation.pluginAdded.subscribe(plugin=>{
      this.plugins.push(plugin);
    })
  }

  defaultWidth(): number {
    return 600;
  }

  defaultHeight(): number {
    return 600;
  }

  ngOnDestroy(): void {

  }

  id(): string {
    return "sysinfo";
  }

  title(): string {
    return "sysinfo";
  }

  destroy(): void {

  }

  activate(): void {

  }

}
