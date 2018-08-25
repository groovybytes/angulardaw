import {Inject, Injectable} from "@angular/core";
import {Cell} from "../../model/daw/matrix/Cell";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {Track} from "../../model/daw/Track";

@Injectable()
export class ClipsService {

  constructor() {

  }

  toggleScene(index:number, project: Project): void {
    let sceneCell=project.matrix.rowHeader[index];
    if (sceneCell.data === true) {
      project.transport.stop();
      sceneCell.data = false;
    }
    else {
      let row = project.matrix.body[index];
      let cellsToPlay = row.filter(cell => cell.trackId && cell.data);
      let maxPatternLength = 0;
      project.tracks.forEach(track=>track.focusedPattern=null);
      cellsToPlay.forEach(cell => {
        let track = project.getTrack(cell.trackId);
        track.focusedPattern = cell.data;
        if (cell.data.length > maxPatternLength) maxPatternLength = cell.data.length;
      });
      project.matrix.rowHeader.forEach(header => header.data = false);
      sceneCell.data = true;
      project.transport.params.loopEnd.next(maxPatternLength);
      project.transport.params.loop.next(true);
      project.transport.start();
    }

  }

  toggleClip(pattern:Pattern, track:Track): void {
    if (track.transport.isRunning()) {
      track.transport.stop();
    }
    else {
      //this.trackService.toggleSolo(project,track);
      track.resetEvents(pattern.events);
      track.focusedPattern=pattern;
      track.transport.start();
    }


  }

  clipIsRunning(trackId: string, pattern: Pattern, project: Project): boolean {
    let track = project.getTrack(trackId);
    return (track.focusedPattern && track.focusedPattern.id === pattern.id) && (track.transport.isRunning() || project.transport.isRunning());
  }
}
