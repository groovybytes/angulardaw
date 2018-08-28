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
import {DragHandler} from "./DragHandler";
import {DawMatrixService} from "./daw-matrix.service";
import {Track} from "../model/daw/Track";
import {Cell} from "../model/daw/matrix/Cell";
import {Pattern} from "../model/daw/Pattern";
import {ClipsService} from "../shared/services/clips.service";


@Component({
  selector: 'daw-matrix',
  templateUrl: './daw-matrix.component.html',
  styleUrls: ['./daw-matrix.component.scss']
})
export class DawMatrixComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() project: Project;
  @ViewChildren('cell')
  cells: QueryList<ElementRef>;

  dragHandler: DragHandler = new DragHandler();

  constructor(private el: ElementRef, private matrixService: DawMatrixService,  private clipsService:ClipsService) {
  }


  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {


  }

  onCellBtnClicked(cell: Cell<Pattern>,event:MouseEvent): void {
    let track = this.project.getTrack(cell.trackId);
    this.clipsService.toggleClip(cell.data,track);
  }
  onCellContainerClicked(cell: Cell<Pattern>): void {
    this.matrixService.onCellContainerClicked(cell, this.project);
  }

  onRowHeaderClicked(cell:Cell<any>):void{
    let track = this.project.getTrack(cell.trackId);
    this.clipsService.toggleScene(cell.row,this.project);
  }
  bodyCellDblClicked(cell: Cell<Pattern>): void {
    this.matrixService.bodyCellDblClicked(cell, this.project);
  }

  getTrack(trackId: string): Track {
    return this.project.tracks.find(track => track.id === trackId);
  }

  patternIsRunning(trackId: string,pattern:Pattern): boolean{
    return this.clipsService.clipIsRunning(trackId,pattern,this.project);
  }

  onDrop(event: DragEvent): void {
    this.matrixService.onDrop(event, this.project, this.project.matrix);
  }

  ngAfterViewInit() {


  }

}
