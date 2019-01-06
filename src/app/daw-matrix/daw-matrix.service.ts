import {Inject, Injectable} from "@angular/core";
import {Matrix} from "../model/daw/matrix/Matrix";
import * as $ from "jquery";
import * as _ from "lodash";
import {TracksService} from "../shared/services/tracks.service";
import {Project} from "../model//daw/Project";
import {Pattern} from "../model//daw/Pattern";
import {ProjectsService} from "../shared/services/projects.service";
import {PatternsService} from "../shared/services/patterns.service";
import {NoteLength} from "../model//mip/NoteLength";
import {KeyboardState} from "../model/KeyboardState";
import {Cell} from "../model/daw/matrix/Cell";
import {A2dClientService} from "angular2-desktop";
import {SequencerComponent} from "../sequencer/sequencer.component";
import {DawInfo} from "../model/DawInfo";

@Injectable()
export class DawMatrixService {

  constructor(private trackService: TracksService,
              private patternService: PatternsService,
              private projectsService: ProjectsService,
              private desktop: A2dClientService,
              @Inject("daw") private daw: DawInfo,
              @Inject("KeyboardState") private keyboardState: KeyboardState) {

  }

  onDrop(event: DragEvent, project: Project, matrix: Matrix): void {
    $(event.target).removeClass("drag-target");
    let data = JSON.parse(event.dataTransfer.getData("text"));

    let sourceCell: Cell<Pattern> = this.findCell(cell => cell.id === data.id, matrix.body);
    let targetCell: Cell<Pattern> = this.findCell(cell => cell.id === $(event.target).attr("id"), matrix.body);
    if (this.keyboardState.Ctrl.getValue() === true) {
      let patternCopy = this.patternService.copyPattern(sourceCell.data, sourceCell.trackId, project);
      targetCell.data = patternCopy;
    } else {
      targetCell.data = sourceCell.data;
      sourceCell.data = null;
    }

  }

  bodyCellDblClicked(cell: Cell<Pattern>, project: Project): void {
    if (!cell.data) {
      let pattern = this.patternService.createPattern(project, cell.trackId, NoteLength.Quarter, 8);
      this.patternService.insertPattern(cell.trackId, cell.row, pattern, project);
    } else project.selectedPattern.next(cell.data);
  }

  bodyCellClicked(cell: Cell<Pattern>, project: Project): void {
    //if (cell.data) cell.data.marked = !cell.data.marked;
    if (cell.data) project.selectedPattern.next(cell.data);
  }

  bodyCellMenuBtnClicked(cell: Cell<Pattern>, project: Project): void {

    let nextRowCell = project.matrix.body[cell.row + 1][cell.column];
    if (nextRowCell.patternMenu) {
      cell.menuOpen = false;
      nextRowCell.patternMenu = null;
    } else {
      nextRowCell.patternMenu = cell.data;
      cell.menuOpen = true;
    }

  }


  onCellContainerClicked(cell: Cell<Pattern>, project: Project): void {

    let trackIndex = project.tracks.findIndex(t => t.id === cell.trackId);
    this.desktop.trigger("sequencer", cell.data.plugin.getInfo().name + "(track " + trackIndex + ")", cell.data.id,
      (component: SequencerComponent, windowId) => {
        component.project = project;
        component.pattern = cell.data;
        component.track = project.tracks[trackIndex];

      })
      .catch(error => console.error(error));
  }

  removePattern(id: string): void {
    let project = this.daw.project.getValue();
    let selectedPattern = project.selectedPattern.getValue();
    let index = project.patterns.findIndex(pattern => pattern.id === id);
    let pattern=project.patterns[index];
    project.patterns.splice(index,1);
    if (selectedPattern && selectedPattern.id === id) project.selectedPattern.next(null);
    let relevantCell = this.findCell(cell => cell.data && cell.data.id === id, project.matrix.body);
    relevantCell.data = null;
    pattern.destroy();

  }

  removePatternsFromRow(project: Project, row: number): void {
    /* let cells = project.matrix.body[row].filter(cell => cell.data);
     cells.forEach(cell => {
       this.patternService.removePattern(project, cell.data.id);
       cell.data = null;
     })*/
  }


  findCell(callback: (cell: Cell<Pattern>) => boolean, cells: Array<Array<Cell<any>>>): Cell<any> {
    return _.flatten(cells).find(cell => callback(cell));
  }

  private getAllCellsForColumn(matrix: Matrix, column: number): Array<Cell<any>> {
    return this.getAllCells(matrix).filter(cell => cell.column === column);
  }

  private getAllCells(matrix: Matrix): Array<Cell<any>> {
    let result: Array<Cell<any>> = _.flatten(matrix.body);
    matrix.header.forEach(cell => result.push(cell));
    matrix.rowHeader.forEach(cell => result.push(cell));

    return result;
  }


}
