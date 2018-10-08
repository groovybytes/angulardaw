import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'header-cell-menu',
  templateUrl: './header-cell-menu.component.html',
  styleUrls: ['./header-cell-menu.component.scss']
})
export class HeaderCellMenuComponent implements OnInit {

  @Input() color: string;
  @Input() colors: Array<string>;
  @Output() colorChanged: EventEmitter<string> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }

  selectColor(color: string): void {
    this.color = color;
    this.colorChanged.emit(color);
  }

}
