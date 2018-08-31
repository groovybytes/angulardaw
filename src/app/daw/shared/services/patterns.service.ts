import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {TransportContext} from "../../model/daw/transport/TransportContext";
import {TransportSettings} from "../../model/daw/transport/TransportSettings";
import {MusicMath} from "../../model/utils/MusicMath";
import {NoteLength} from "../../model/mip/NoteLength";
import {NoteTrigger} from "../../model/daw/NoteTrigger";

@Injectable()
export class PatternsService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext
  ) {

  }

  addPattern(project: Project,
             trackId: string,
             quantization: NoteLength,
             patternLength: number,
             patternId?:string): Pattern {

    let track = project.tracks.find(track => track.id === trackId);

    let transportContext = project.createTransportContext();
    transportContext.settings.loopEnd=patternLength;
    let pattern = new Pattern(
      patternId?patternId:this.guid(),
      track.plugin.getNotes().reverse(),
      transportContext,
      track.plugin,
      quantization,
      track.controlParameters,
      track.gainNode
    );

    pattern.length=patternLength;

    project.patterns.push(pattern);

    return pattern;
  }

  createMetronomeEvents(beatUnit:number): Array<NoteTrigger> {
    let events = [];
    for (let i = 0; i < beatUnit; i++) {
      events.push(new NoteTrigger(null, i === 0 ? "A0" : "", i * MusicMath.getBeatTime(120)));
    }

    return events;
  }

  toggleScene(row:number,project:Project):void{
    if (project.activeSceneRow===row) {
      project.activeSceneRow=null;
      project.stop();
    }
    else{
      let matrixRow = project.matrix.body[row];
      let patterns = matrixRow.filter(cell=>cell.data).map(cell=>cell.data.id);
      if (patterns.length >0){
        project.setChannels(patterns);
        project.activeSceneRow=row;
        project.start();
      }
    }

  }
  togglePattern(patternId:string,project:Project):void{
    if (project.isRunningWithChannel(patternId)) {
      project.stop();
    }
    else{
      project.setChannels([patternId]);
      project.activeSceneRow=null;
      project.start();
    }

  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

}
