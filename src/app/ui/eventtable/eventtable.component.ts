import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {EventEntry} from "./model/EventEntry";
import * as _ from "lodash";
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;

@Component({
  selector: 'event-table',
  templateUrl: './eventtable.component.html',
  styleUrls: ['./eventtable.component.scss']
})
export class EventtableComponent<T> implements OnInit, AfterViewInit,OnChanges {

  @Input() events: Array<EventEntry<T>> = [];
  @ViewChild('targetTable')
  targetTable: ElementRef;

  @Output() entryActiveChanged: EventEmitter<EventEntry<T>> = new EventEmitter();
  @Output() entryClicked: EventEmitter<EventEntry<T>> = new EventEmitter();
  @Output() entryDblClicked: EventEmitter<EventEntry<T>> = new EventEmitter();
  @Output() entryRightClicked: EventEmitter<EventEntry<T>> = new EventEmitter();

  columns: Array<number>;
  rows: Array<number>;

  cellWidth: number;
  cellHeight: number;

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

  constructor(private el: ElementRef) {
  }

  getRows(): Array<any> {
    console.log("get rows");
    return _.uniqBy(this.events, (ev) => ev.row.getValue());

  }


  getActiveEvents(): Array<EventEntry<T>> {
    return this.events.filter(ev=>ev.active.getValue()===true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.events){
      console.log("changes");
      this.columns=_.sortedUniq(this.events.filter(ev=>ev.row.getValue()===0).map(ev=>ev.column.getValue()));
      this.rows=_.sortedUniq(this.events.filter(ev=>ev.column.getValue()===0).map(ev=>ev.row.getValue()));
    }
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

  onEventDblClicked(entry: EventEntry<T>): void {

  }

  onEventClicked(entry: EventEntry<T>): void {

  }


  /*  onDrag(data: { event: Event, ui: DraggableEventUIParams, data: EventEntry<T> }) {
      //console.log(data.data.offGrid);
      /!*if (data.data.offGrid && this.useGrid) {
        console.log("here");
        data.data.column = Math.ceil(data.data.left / this.cellWidth) - 1;
        data.data.left = data.data.column * this.cellWidth;
        data.data.offGrid = false;
      }
      else {*!/
      //data.data.offGrid = this.useGrid === false;
      data.data.left = data.ui.position.left;
      data.data.top = data.ui.position.top;
      data.data.column = Math.ceil(data.data.left / this.tableCellWidth) - 1;
      /!* }*!/

      this.entryUpdated.emit(data.data);
    }*/

  onEventDrag(data: { event: Event, ui: DraggableEventUIParams, data: any }) {

  }

  /* getDragParams(entry: EventEntry<T>): DraggableOptions {
     return {
       scroll: false,
       containment: 'parent',
       grid: this.getDragGrid(entry)
       //grid: [1, this.cellHeight],
       /!* snapMode: "inner",
        snap:".snap-cell"*!/
     }
   }*/

  /*  private getDragGrid(entry): any {
      if (this.tableCellWidth) return this.useGrid && entry.offGrid === false ? [this.tableCellWidth, this.tableCellHeight] : [1, this.tableCellHeight];
      else return [1, 1];
    }*/

  /* onEntryMouseDown(entry: FlexyGridEntry<T>, event): void {
     /!*  console.log($(event.target).position());
       let element=$(event.target);
       let left=element.position().left;
       let newX=Math.round(left / 100) * 100;
       console.log(element);
       console.log(element.draggable("instance"));
       entry.left=newX;*!/

   }*/

  ngAfterViewInit() {

    setTimeout(() => {
      let reference = this.targetTable.nativeElement.querySelector("td");
      if (reference) {
        this.cellWidth = reference.getBoundingClientRect().width;
        this.cellHeight = reference.getBoundingClientRect().height;
      }
    })

  }


}

