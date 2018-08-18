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
  @Input() highlightColumn: number = 0;
  @Input() useColumnHighlighting: boolean = false;

  @Output() entryAdded: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryUpdated: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryRemoved: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() entryClicked: EventEmitter<FlexyGridEntry<T>> = new EventEmitter();
  @Output() cellClicked: EventEmitter<ContentCell> = new EventEmitter();

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {

    if (event.which === 16) {
      this.useGrid = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.which === 16) {
      this.useGrid = true;
    }
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
    let newEntry = new FlexyGridEntry(null, cell.column * this.cellWidth, cell.row * this.cellHeight, cell.column);
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

  onDrag(data: { event: Event, ui: DraggableEventUIParams, data: FlexyGridEntry<any> }) {
    //console.log(data.data.offGrid);
    /*if (data.data.offGrid && this.useGrid) {
      console.log("here");
      data.data.column = Math.ceil(data.data.left / this.cellWidth) - 1;
      data.data.left = data.data.column * this.cellWidth;
      data.data.offGrid = false;
    }
    else {*/
      data.data.offGrid=this.useGrid===false;
      data.data.left = data.ui.position.left;
      data.data.top = data.ui.position.top;
      data.data.column = Math.ceil(data.data.left / this.cellWidth) - 1;
   /* }*/

    this.entryUpdated.emit(data.data);
  }

  onDragStart(data: { event: Event, ui: DraggableEventUIParams, data: any }) {

  }

  getDragParams(entry: FlexyGridEntry<T>): DraggableOptions {
    return {
      scroll: false,
      containment: 'parent',
      grid: this.useGrid && entry.offGrid === false ? [this.cellWidth, this.cellHeight] : [1, this.cellHeight]
      //grid: [1, this.cellHeight],
     /* snapMode: "inner",
      snap:".snap-cell"*/
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

