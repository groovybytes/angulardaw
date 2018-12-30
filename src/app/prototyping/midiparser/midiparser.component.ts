import {Component, Inject, OnInit} from '@angular/core';
import {Notes} from "../../model/mip/Notes";
import {ProjectsService} from "../../shared/services/projects.service";
import {NoteEvent} from "../../model/mip/NoteEvent";

declare var MidiConvert;

@Component({
  selector: 'app-midiparser',
  templateUrl: './midiparser.component.html',
  styleUrls: ['./midiparser.component.scss']
})
export class MidiparserComponent implements OnInit {

  constructor(@Inject("Notes") private notes:Notes,
              private projectsService:ProjectsService) { }

  ngOnInit() {


    this.projectsService.initializeNewProject("tmp", "tmp", ["bass_acoustic"])
      .then(project => {


        MidiConvert.load("assets/midi/loops/bass/1.mid", (midi)=> {
          let converted = midi.tracks[1].notes.map(midiEvent=>{
            let noteInfo=this.notes.notes.find(d=>d.midi===midiEvent.midi);
            let event = new NoteEvent(noteInfo.id,midiEvent.time,midiEvent.duration,midiEvent.velocity);
            return event;
          });
          console.log(converted);
        })
      });

  }


}
