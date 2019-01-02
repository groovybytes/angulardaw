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
import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";

@Injectable()
export class PatternsService {

  constructor(
    private scriptEngine: ScriptEngine,
    private fileService: FilesApi,
    private config: AppConfiguration,
    private eventStream: EventStreamService) {

  }

  createPattern(project: Project,
                trackId: string,
                quantization: NoteLength,
                patternLength: number,
                patternId?: string): Pattern {

    let track = project.tracks.find(track => track.id === trackId);
    let plugin = track.getMasterPlugin();


    let transportContext = project.createTransportContext();
    transportContext.settings.loopEnd = patternLength;
    let ticker = project.threads.find(t => t.id === "ticker");
    let pattern = new Pattern(
      patternId ? patternId : Lang.guid(),
      plugin.triggers.map(trigger => trigger.spec).reverse(),
      ticker,
      project.settings,
      this.scriptEngine,
      transportContext,
      plugin,
      quantization
    );

    pattern.length = patternLength;

    project.patterns.push(pattern);

    return pattern;
  }

  createPatternFromUrl(project: Project,
                       trackId: string, url: string): Promise<Pattern> {

    return new Promise<Pattern>(((resolve, reject) => {
      this.fileService.getFile(this.config.getAssetsUrl(url))
        .then((patternJson) => {
          let newPattern = this.createPattern(project,trackId,patternJson.quantization,patternJson.length);
          patternJson.events.forEach(event=>{
            newPattern.events.push(new NoteEvent(event.note, event.time, event.length));
          });

          resolve(newPattern);

        })
        .catch(error => reject(error));

    }));


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
    let ticker = project.threads.find(t => t.id === "ticker");
    let patternClone = new Pattern(
      Lang.guid(),
      plugin.triggers.map(trigger => trigger.spec).reverse(),
      ticker,
      project.settings,
      this.scriptEngine,
      transportContext,
      plugin,
      pattern.quantization.getValue()
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

  startPattern(patternId: string, project: Project): void {
    let pattern = project.patterns.find(pattern => pattern.id === patternId);
    let session = project.session;//this.transport.createSession(pattern.plugin);
    project.setChannels([patternId]);
    session.start([pattern],true,
      MusicMath.getLoopLength(pattern.length,project.bpm.getValue()));
    /*if (project.isRunningWithChannel(patternId)) {
      this.eventStream.stop();
    } else {*/

    /*project.setChannels([patternId]);
    project.activeSceneRow = null;*/
    /*let pattern = project.patterns.find(pattern=>pattern.id===patternId);
    let session=this.transport.createSession(pattern.plugin);
    session.start(pattern.events);*/

    //}

  }

  stop(project: Project): void {
   // this.eventStream.stop();
    project.session.stop();
    project.setChannels([]);
  }


}
