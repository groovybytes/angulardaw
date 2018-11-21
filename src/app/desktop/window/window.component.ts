import {Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LayoutManagerService} from "../layout-manager.service";
import {DomSanitizer} from "@angular/platform-browser";
import {DesktopWindow} from "../model/DesktopWindow";

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit,OnChanges {

  @Input() title: string;
  @Input() order: number;
  @Input() showHeader:boolean=true;
  @Input() position:string;
  @Input() height:number;

  @HostBinding('attr.class')
  get clazz() {
    return this.window?this.window.clazz:"";
  }
  @HostBinding('style')
  get style() {
    let zIndex=this.window?this.window.zIndex:0;
    return this.sanitizer.bypassSecurityTrustStyle('z-index:'+zIndex.toString());

  }

  window:DesktopWindow;


  constructor(private layout: LayoutManagerService,private sanitizer:DomSanitizer) {
  }

  ngOnInit() {
    this.layout.addWindowWithOrder(this.order);

  }

  ngOnChanges(changes: SimpleChanges): void {

    /*if (changes["id"]){
      this.window=this.layout.getWindow(this.id);
    }*/
  }

}
