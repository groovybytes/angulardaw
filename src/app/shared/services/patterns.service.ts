import {Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {MusicMath} from "../../model/utils/MusicMath";
import {NoteLength} from "../../model/mip/NoteLength";
import * as _ from "lodash";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {ScriptEngine} from "./scriptengine.service";
import {EventStreamService} from "./event-stream.service";
import {Lang} from "../../model/utils/Lang";

@Injectable()
export class PatternsService {

  constructor(private scriptEngine: ScriptEngine, private eventStream: EventStreamService) {

  }

  addPattern(project: Project,
             trackId: string,
             quantization: NoteLength,
             patternLength: number,
             patternId?: string): Pattern {

    let track = project.tracks.find(track => track.id === trackId);
    let plugin = track.getMasterPlugin();


    let transportContext = project.createTransportContext();
    transportContext.settings.loopEnd = patternLength;
    let pattern = new Pattern(
      patternId ? patternId : Lang.guid(),
      plugin.triggers.map(trigger => trigger.spec).reverse(),
      this.scriptEngine,
      transportContext,
      plugin,
      quantization,
      track.controlParameters
    );

    pattern.length = patternLength;

    project.patterns.push(pattern);

    return pattern;
  }

  removePattern(project: Project, patternId: string): void {
    let selectedPattern = project.selectedPattern.getValue();
    _.remove(project.patterns, pattern => pattern.id === patternId);
    if (selectedPattern && selectedPattern.id === patternId) project.selectedPattern.next(null);
  }

  copyPattern(pattern: Pattern, trackId: string, project: Project): Pattern {
    let track = project.tracks.find(track => track.id === trackId);

    let plugin = track.getMasterPlugin();
    let transportContext = project.createTransportContext();
    transportContext.settings.loopEnd = pattern.length;
    let patternClone = new Pattern(
      Lang.guid(),
      plugin.triggers.map(trigger => trigger.spec).reverse(),
      this.scriptEngine,
      transportContext,
      plugin,
      pattern.quantization.getValue(),
      track.controlParameters
    );

    patternClone.length = pattern.length;

    pattern.events.forEach(event => {
      patternClone.events.push(_.clone(event));
    });

    project.patterns.push(patternClone);

    return patternClone;
  }

  createMetronomeEvents(beatUnit: number): Array<NoteEvent> {
    let events = [];
    for (let i = 0; i < beatUnit; i++) {
      events.push(new NoteEvent(i === 0 ? "A0" : "", i * MusicMath.getBeatTime(120)));
    }

    return events;
  }

  toggleScene(row: number, project: Project): void {
    if (project.activeSceneRow === row) {
      project.activeSceneRow = null;
      this.eventStream.stop();
    } else {
      let matrixRow = project.matrix.body[row];
      let patterns = matrixRow.filter(cell => cell.data).map(cell => cell.data.id);
      if (patterns.length > 0) {
        project.setChannels(patterns);
        project.activeSceneRow = row;
        this.eventStream.start();
      }
    }

  }

  togglePattern(patternId: string, project: Project): void {

    if (project.isRunningWithChannel(patternId)) {
      this.eventStream.stop();
    } else {

      project.setChannels([patternId]);
      project.activeSceneRow = null;

      this.eventStream.start();

    }

  }

  stopAndClear(project: Project): void {
    this.eventStream.stop();
    project.setChannels([]);
  }


}
