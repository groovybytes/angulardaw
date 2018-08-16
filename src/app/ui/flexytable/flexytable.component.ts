import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ContentCell} from "./model/ContentCell";
import {HeaderCell} from "./model/HeaderCell";
import {FlexyGridEntry} from "./model/FlexyGridEntry";
import DraggableOptions = JQueryUI.DraggableOptions;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;

@Component({
  selector: 'flexytable',
  templateUrl: './flexytable.component.html',
  styleUrls: ['./flexytable.component.scss']
})
export class FlexytableComponent<T> implements OnInit, AfterViewInit {

  @Input() cellHeight: number = 50;
  @Input() cellWidth: number = 100;
  @Input() contentCells: Array<Array<ContentCell>> = [];
  @Input() headerCells: Array<HeaderCell<any>> = [];
  @Input() entries: Array<FlexyGridEntry<T>> = [];

  @Output() entryAdded: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryUpdated: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryRemoved: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryClicked: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() cellClicked: EventEmitter<ContentCell> = new EventEmitter();

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.which === 16) this.useGrid = false;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.which === 16) this.useGrid = true;
  }

  grid: Array<number>;
  useGrid: boolean = true;

  constructor() {
  }

  ngOnInit() {

    /* this.headerCells = new Array(10).fill(new HeaderCell());
     this.contentCells = [];
     for (let i = 0; i < 100; i++) {
       this.contentCells.push([]);
       for (let j = 0; j < 10; j++) {
         this.contentCells[i].push(new ContentCell(i, j));
       }
     }*/
  }

  onContentCellDblClicked(cell: ContentCell): void {
    let newEntry = new FlexyGridEntry(null, cell.column * this.cellWidth, cell.row * this.cellHeight);
    this.entries.push(newEntry);
    this.entryAdded.emit(newEntry);


  }

  onEntryDblClicked(entry: FlexyGridEntry<any>): void {
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);
    this.entryRemoved.emit(entry);
  }

  onEntryClicked(entry: FlexyGridEntry<any>): void {
    this.entryClicked.emit(entry);
  }

  onCellClicked(cell: ContentCell): void {
    this.cellClicked.emit(cell);
  }

  getDragParams(entry: FlexyGridEntry<T>): DraggableOptions {
    return {
      scroll: false,
      scrollSensitivity: 100,
      scrollSpeed: 100,
      containment: 'parent',
      grid: this.useGrid ? [this.cellWidth, this.cellHeight] : [1, this.cellHeight],
      start: (event: Event, ui: DraggableEventUIParams) => {

      },
      drag: (event: Event, ui: DraggableEventUIParams) => {
        entry.left = ui.position.left;
        entry.top = ui.position.top;
        this.entryUpdated.emit(entry);
        //entry.isOffGrid=!this.useGrid;
      }
      , stop: (event: Event, ui: DraggableEventUIParams) => {
        //$(event.target).css({"left":"0px"})
      },
    }
  }

  onEntryMouseDown(entry: FlexyGridEntry<T>, event): void {
    /*  console.log($(event.target).position());
      let element=$(event.target);
      let left=element.position().left;
      let newX=Math.round(left / 100) * 100;
      console.log(element);
      console.log(element.draggable("instance"));
      entry.left=newX;*/

  }

  ngAfterViewInit(): void {

    /*console.log($(".cell-content").first().width());
    this.grid=[$(".cell-content").first().width(),50];*/
  }


}
