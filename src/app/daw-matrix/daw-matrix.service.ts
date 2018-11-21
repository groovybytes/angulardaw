import {Inject, Injectable} from "@angular/core";
import {Matrix} from "../model/daw/matrix/Matrix";
import * as $ from "jquery";
import * as _ from "lodash";
import {Cell} from "../model//daw/matrix/Cell";
import {TracksService} from "../shared/services/tracks.service";
import {Project} from "../model//daw/Project";
import {PluginsService} from "../shared/services/plugins.service";
import {Pattern} from "../model//daw/Pattern";
import {ProjectsService} from "../shared/services/projects.service";
import {PatternsService} from "../shared/services/patterns.service";
import {NoteLength} from "../model//mip/NoteLength";
import {KeyboardState} from "../model/KeyboardState";
import {MatrixService} from "../shared/services/matrix.service";
import {AudioNodesService} from "../shared/services/audionodes.service";
import {System} from "../system/System";
import {LayoutManagerService} from "../desktop/layout-manager.service";

@Injectable()
export class DawMatrixService {

  constructor(private trackService: TracksService,
              private patternService: PatternsService,
              private projectsService: ProjectsService,
              @Inject("KeyboardState") private keyboardState: KeyboardState,
              private layout:LayoutManagerService,
              private matrixService: MatrixService,
              private nodesService:AudioNodesService,
              private pluginService: PluginsService, private system: System) {

  }

  onDrop(event: DragEvent, project: Project, matrix: Matrix): void {
    $(event.target).removeClass("drag-target");
    let data = JSON.parse(event.dataTransfer.getData("text"));

    let sourceCell: Cell<Pattern> = this.findBodyCell(data.id, matrix.body);
    let targetCell: Cell<Pattern> = this.findBodyCell($(event.target).attr("id"), matrix.body);
    if (this.keyboardState.Ctrl.getValue() === true) {
      let patternCopy = this.patternService.copyPattern(sourceCell.data, sourceCell.trackId, project);
      targetCell.data = patternCopy;
    }
    else {
      targetCell.data = sourceCell.data;
      sourceCell.data = null;
    }

  }

  bodyCellDblClicked(cell: Cell<Pattern>, project: Project): void {

    if (cell.trackId) {
      //let track = project.tracks.find(track => track.id === cell.trackId);
      let rowHeaderCell = project.matrix.rowHeader.find(header => header.row === cell.row);
      if (!cell.data) {
        let pattern = this.patternService.addPattern(project, cell.trackId, NoteLength.Quarter, 8);
        cell.data = pattern;
      }
      project.selectedPattern.next(cell.data);
      this.layout.openWindow("sequencer");
    }
  }

  bodyCellClicked(cell: Cell<Pattern>, project: Project): void {
    //if (cell.data) cell.data.marked = !cell.data.marked;
    if (cell.data) project.selectedPattern.next(cell.data);
  }

  bodyCellMenuBtnClicked(cell: Cell<Pattern>, project: Project): void {

      let nextRowCell = project.matrix.body[cell.row + 1][cell.column];
      if (nextRowCell.patternMenu) {
        cell.menuOpen=false;
        nextRowCell.patternMenu=null;
      }
      else {
        nextRowCell.patternMenu = cell.data;
        cell.menuOpen=true;
      }

  }


  onCellContainerClicked(cell: Cell<Pattern>, project: Project): void {

    //project.desktop.toggleWindow("sequencer");
    /*  let track = project.getTrack(cell.trackId);
      track.focusedPattern = cell.data;
      project.selectedTrack = track;

      project.sequencerOpen = true;*/
  }

  removePatternsFromRow(project: Project, row: number): void {
    let cells = project.matrix.body[row].filter(cell => cell.data);
    cells.forEach(cell => {
      this.patternService.removePattern(project, cell.data.id);
      cell.data = null;
    })
  }


  private findBodyCell(id: string, cells: Array<Array<Cell<any>>>): Cell<any> {
    return _.flatten(cells).find(cell => cell.id === id);
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

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


}
