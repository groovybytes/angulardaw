import {Inject, Injectable} from "@angular/core";
import {Matrix} from "../model/daw/matrix/Matrix";
import * as $ from "jquery";
import * as _ from "lodash";
import {Cell} from "../model/daw/matrix/Cell";
import {TracksService} from "../shared/services/tracks.service";
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";
import {PluginsService} from "../shared/services/plugins.service";
import {System} from "../../system/System";
import {Pattern} from "../model/daw/Pattern";
import {ProjectsService} from "../shared/services/projects.service";
import {PatternsService} from "../shared/services/patterns.service";
import {NoteLength} from "../model/mip/NoteLength";
import {TransportSettings} from "../model/daw/transport/TransportSettings";
import {KeyboardState} from "../shared/model/KeyboardState";

@Injectable()
export class DawMatrixService {

  constructor(private trackService: TracksService,
              private patternService: PatternsService,
              private projectsService: ProjectsService,
              @Inject("KeyboardState") private keyboardState: KeyboardState,
              private pluginService: PluginsService, private system: System) {

  }

  onDrop(event: DragEvent, project: Project, matrix: Matrix): void {
    $(event.target).removeClass("drag-target");
    let data = JSON.parse(event.dataTransfer.getData("text"));
    if (data.command === "plugin") {
      let cell = this.findBodyCell($(event.target).attr("id"), matrix.body);
      this.addTrackWithPlugin(data.id, cell, matrix, project)
        .catch(error => this.system.error(error));
    }
    else {
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


      /*if (targetCell.trackId !== sourceCell.trackId) {
        let sourceTrack = project.tracks.find(t => t.id === sourceCell.trackId);
        let targetTrack = project.tracks.find(t => t.id === targetCell.trackId);
        let patternIndex = sourceTrack.patterns.findIndex(p => p.id === targetCell.data.id);
        targetTrack.patterns.push(sourceTrack.patterns[patternIndex]);
        sourceTrack.patterns.splice(patternIndex, 1);
      }*/
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
      project.sequencerOpen = true;
    }
  }

  bodyCellClicked(cell: Cell<Pattern>, project: Project): void {
    if (cell.data) cell.data.marked = !cell.data.marked;
    console.log(cell);
  }

  onCellContainerClicked(cell: Cell<Pattern>, project: Project): void {
    /*  let track = project.getTrack(cell.trackId);
      track.focusedPattern = cell.data;
      project.selectedTrack = track;

      project.sequencerOpen = true;*/
  }


  /*startScene(cell: Cell<any>, project: Project): void {
    if (cell.data === true) {
      project.transport.stop();
      cell.data = false;
    }
    else {
      let row = project.matrix.body[cell.row];
      let cellsToPlay = row.filter(cell => cell.trackId && cell.data);
      let maxPatternLength = 0;
      project.tracks.forEach(track=>track.focusedPattern=null);
      cellsToPlay.forEach(cell => {
        let track = project.getTrack(cell.trackId);
        track.focusedPattern = cell.data;
        if (cell.data.length > maxPatternLength) maxPatternLength = cell.data.length;
      });
      project.matrix.rowHeader.forEach(header => header.data = false);
      cell.data = true;
      project.transport.params.loopEnd.next(maxPatternLength);
      project.transport.params.loop.next(true);
      project.transport.start();
    }

  }

  startClip(cell: Cell<Pattern>, project: Project, event: MouseEvent): void {
    event.stopPropagation();
    let track = project.getTrack(cell.trackId);
    if (track.transport.isRunning()) {
      track.transport.stop();
    }
    else {
      //this.trackService.toggleSolo(project,track);
      track.resetEvents(cell.data.events);
      track.focusedPattern=cell.data;
      track.transport.start();
    }


  }*/


  private addTrackWithPlugin(pluginId: string, cell: Cell<Pattern>, matrix: Matrix, project: Project): Promise<void> {

    return new Promise((resolve, reject) => {
      let track: Track;
      if (!cell.trackId) {
        track = this.trackService.addTrack(project, cell.column);
        let header = matrix.header.find(header => header.column === cell.column);
        header.data = track;
        this.getAllCellsForColumn(project.matrix, cell.column).forEach(_cell => _cell.trackId = track.id);
      }
      else track = project.tracks.find(t => t.id === cell.trackId);

      let pluginInfo = project.plugins.find(p => p.id === pluginId);
      this.pluginService.loadPluginWithInfo(pluginInfo)
        .then(plugin => {
          track.plugin = plugin;
          track.name = plugin.getId();


          resolve();
        })
        .catch(error => reject(error));
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
