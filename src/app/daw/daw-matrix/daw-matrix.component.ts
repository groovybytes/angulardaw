import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {Project} from "../model/daw/Project";
import {DawMatrixService} from "./daw-matrix.service";
import {Track} from "../model/daw/Track";
import {Cell} from "../model/daw/matrix/Cell";
import {Pattern} from "../model/daw/Pattern";
import {PatternsService} from "../shared/services/patterns.service";
import {DragHandler} from "../model/daw/visual/DragHandler";
import {MatrixDragHandler} from "./DragHandler";


@Component({
  selector: 'daw-matrix',
  templateUrl: './daw-matrix.component.html',
  styleUrls: ['./daw-matrix.component.scss']
})
export class DawMatrixComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() project: Project;
  @ViewChildren('cell')
  cells: QueryList<ElementRef>;

  dragHandler: DragHandler;

  constructor(private el: ElementRef,
              private patternsService:PatternsService,
              private matrixService: DawMatrixService) {
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.project && changes.currentValue){
      this.dragHandler=new MatrixDragHandler(this.project,this.matrixService);
    }

  }

  ngOnInit() {


  }

  onCellBtnClicked(cell: Cell<Pattern>, event: MouseEvent): void {
    this.patternsService.togglePattern( cell.data.id,this.project);
  }

  onCellContainerClicked(cell: Cell<Pattern>): void {
    this.matrixService.onCellContainerClicked(cell, this.project);
  }

  onRowHeaderClicked(cell: Cell<string>): void {
    this.patternsService.toggleScene(cell.row,this.project);
  }

  bodyCellDblClicked(cell: Cell<Pattern>): void {
    this.matrixService.bodyCellDblClicked(cell, this.project);
  }

  getTrack(trackId: string): Track {
    return this.project.tracks.find(track => track.id === trackId);
  }

  ngAfterViewInit() {


  }

}
