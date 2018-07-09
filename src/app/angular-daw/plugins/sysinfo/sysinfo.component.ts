import {Component, ElementRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'sysinfo',
  templateUrl: './sysinfo.component.html',
  styleUrls: ['./sysinfo.component.scss']
})
export class SysinfoComponent  extends DawPlugin implements OnInit, OnDestroy {

  @HostBinding('class')
  elementClass = 'plugin';

  plugins: Array<DawPlugin> = [];
  activated: boolean = false;

  constructor(protected element: ElementRef, protected dawService: AngularDawService) {
    super(dawService);
    this.dawService.pluginAdded.subscribe(plugin=>{
      this.plugins.push(plugin);
  })
  }

  ngOnInit() {




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
