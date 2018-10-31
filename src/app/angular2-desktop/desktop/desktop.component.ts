import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {DesktopManager} from "../model/DesktopManager";
import {WindowComponent} from "../window/window.component";


@Component({
  selector: 'desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit,AfterViewInit,AfterContentInit {

  @Input() desktop:DesktopManager;
  @ContentChildren(WindowComponent) windows:QueryList<WindowComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {

  }

}
