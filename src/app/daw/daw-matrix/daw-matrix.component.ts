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
import {TransportSettings} from "../model/daw/transport/TransportSettings";
import {ProjectsService} from "../shared/services/projects.service";


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

  constructor(private el: ElementRef,
              private projectsService:ProjectsService,
              private matrixService: DawMatrixService) {
  }


  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {


  }

  onCellBtnClicked(cell: Cell<Pattern>, event: MouseEvent): void {
    this.projectsService.toggleChannel(this.project, cell.data.id, cell.data.transportContext.settings);
  }

  onCellContainerClicked(cell: Cell<Pattern>): void {
    this.matrixService.onCellContainerClicked(cell, this.project);
  }

  onRowHeaderClicked(cell: Cell<string>): void {
    this.projectsService.toggleChannel(this.project, cell.data);
  }

  bodyCellDblClicked(cell: Cell<Pattern>): void {
    this.matrixService.bodyCellDblClicked(cell, this.project);
  }

  getTrack(trackId: string): Track {
    return this.project.tracks.find(track => track.id === trackId);
  }

  onDrop(event: DragEvent): void {
    this.matrixService.onDrop(event, this.project, this.project.matrix);
  }

  ngAfterViewInit() {


  }

}
