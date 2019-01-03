import {Inject, Injectable} from '@angular/core';
import {NoteEvent} from "../../model/mip/NoteEvent";
import {Notes} from "../../model/mip/Notes";
import {NoteLength} from "../../model/mip/NoteLength";
import {Pattern} from "../../model/daw/Pattern";
import {PatternsService} from "./patterns.service";
import {DawInfo} from "../../model/DawInfo";
import {TracksService} from "./tracks.service";
import {Project} from "../../model/daw/Project";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {MatrixService} from "./matrix.service";
import {MusicMath} from "../../model/utils/MusicMath";

declare var MidiConvert;

@Injectable({
  providedIn: 'root'
})
export class MidiBridgeService {

  constructor(
    @Inject("Notes") private notes: Notes,
    private patternService: PatternsService,
    private tracksService: TracksService,
    private matrixService:MatrixService,
    @Inject("daw") private daw: DawInfo) {
  }


  convertMidiX(url: string): Promise<Array<NoteEvent>> {

    return new Promise<Array<NoteEvent>>((resolve, reject) => {
      MidiConvert.load(url, (midi) => {
        let converted = midi.tracks[1].notes.map(midiEvent => {
          let noteInfo = this.notes.notes.find(d => d.midi === midiEvent.midi);
          return new NoteEvent(noteInfo.id, null, midiEvent.time * 1000, midiEvent.duration, midiEvent.velocity);
        });
        resolve(converted);
      })
    });


  }

  requestMidiFile(url: string): Promise<any> {

    return new Promise<Array<NoteEvent>>((resolve, reject) => {
      MidiConvert.load(url, (midi) => {
        resolve(midi);
      });
    });


  }

  convertMidi(url: string): Promise<Array<Pattern>> {

    return new Promise<Array<Pattern>>((resolve, reject) => {
      MidiConvert.load(url, (midi) => {
        midi.tracks.filter(track => track.channelNumber >= 0)
          .forEach(track => {
            console.log(track);
          });

        resolve(null);
      })
    });


  }

  convertMidiTrackToPattern(midiTrack: any, trackId: string): Promise<Pattern> {
    return new Promise<Pattern>((resolve, reject) => {
      let project = this.daw.project.getValue();
     // console.log(midiTrack.duration);
      let beats=MusicMath.getBeatsForDuration(project.bpm.getValue(), midiTrack.duration);
      let pattern = this.patternService.createPattern(project, trackId, NoteLength.Quarter, beats);
      midiTrack.notes.forEach(midiEvent => {
        let noteInfo = this.notes.notes.find(d => d.midi === midiEvent.midi);
        pattern.insertNote(new NoteEvent(noteInfo.id, midiEvent.time* 1000, midiEvent.duration* 1000));
      });
      resolve(pattern);

    });

  }

  createTracksFromMidi(file: string, project: Project): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      this.requestMidiFile(file)
        .then(midiFile => {
          let addPlugin: (midiTrack) => Promise<void> = (midiTrack) => {
            return new Promise<void>(((resolve1, reject1) => {

              let plugin = project.plugins.find(plugin => plugin.getInfo().id === PluginId.PIANO);
              this.matrixService.addMatrixColumnWithPlugin(plugin.getInfo(), project)
                .then(track => {
                  this.convertMidiTrackToPattern(midiTrack, track.id)
                    .then(pattern => {
                      //this.copyMidiNotesToPattern(pattern, midiTrack.notes);
                      this.patternService.insertPattern(track.id,0,pattern,project);
                      resolve1();
                    })
                })
                .catch(error => reject1(error));
            }));
          };
          let promises = [];
          midiFile.tracks.filter(track => track.channelNumber >= 0)
            .forEach(midiTrack => {
              console.log("found track");
              promises.push(addPlugin(midiTrack));
            });

          Promise.all(promises)
            .then(() => resolve())
            .catch(error => reject(error));

        })
        .catch(error => reject(error));
    }))

  }


}
