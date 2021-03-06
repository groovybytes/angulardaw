import {
  AfterViewInit,
  Component,
  ElementRef, Inject,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {DawMatrixService} from "./daw-matrix.service";
import {PatternsService} from "../shared/services/patterns.service";
import {MatrixDragHandler} from "./DragHandler";
import {MatrixService} from "../shared/services/matrix.service";
import {TracksService} from "../shared/services/tracks.service";
import {Project} from "../model/daw/Project";
import {DragHandler} from "../model/daw/visual/DragHandler";
import {System} from "../system/System";
import {Pattern} from "../model/daw/Pattern";
import {Cell} from "../model/daw/matrix/Cell";
import {Track} from "../model/daw/Track";
import {PluginInfo} from "../model/daw/plugins/PluginInfo";
import {DawInfo} from "../model/DawInfo";


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
              private patternsService: PatternsService,
              private matrixService: MatrixService,
              @Inject("daw") private daw: DawInfo,
              private tracksService: TracksService,
              private system: System,

              private dawMatrixService: DawMatrixService) {
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.project && changes.project.currentValue) {
      this.dragHandler = new MatrixDragHandler(this.project, this.dawMatrixService);
    }

  }

  ngOnInit() {


  }



  onCellBtnClicked(cell: Cell<Pattern>, event: MouseEvent): void {

    this.patternsService.togglePattern(cell.data.id);
  }

  onCellContainerClicked(cell: Cell<Pattern>): void {
    this.dawMatrixService.onCellContainerClicked(cell, this.project);
  }

  onRowHeaderClicked(row: number): void {
    this.patternsService.toggleScene(row);
  }

  pluginSelected(plugin: PluginInfo): void {
    this.matrixService.addMatrixColumnWithPlugin(plugin, this.project)
      .catch(error => this.system.error(error));
  }



  addRow(): void {
    this.matrixService.addRow(this.project.matrix);
  }



  bodyCellMenuBtnClicked(cell: Cell<Pattern>): void {
    this.dawMatrixService.bodyCellMenuBtnClicked(cell, this.project);
  }

  bodyCellDblClicked(cell: Cell<Pattern>): void {
    this.dawMatrixService.bodyCellDblClicked(cell, this.project);
  }

  bodyCellClicked(cell: Cell<Pattern>): void {
    this.dawMatrixService.bodyCellClicked(cell, this.project);
  }

  onHeaderClicked(cell: Cell<Track>): void {
    this.project.selectedTrack.next(cell.data);
  }

  getTrack(trackId: string): Track {
    return this.project.tracks.find(track => track.id === trackId);
  }

  colorChanged(color: string, trackId: string): void {
    this.project.tracks.find(track => track.id === trackId).color = color;
  }

  ngAfterViewInit() {


  }

}
