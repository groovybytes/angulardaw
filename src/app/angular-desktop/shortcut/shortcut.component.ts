/*
import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {

  @Input() pluginId: string;
  @Input() title: string;
  @Input() @HostBinding('style.left.px') x: string;
  @Input() @HostBinding('style.top.px') y: string;
  @Input() icon: string;
  @Output() shortcutClicked:EventEmitter<string>=new EventEmitter<string>();

  @HostListener('dblclick') onClick() {
    this.shortcutClicked.emit(this.pluginId);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
*/
