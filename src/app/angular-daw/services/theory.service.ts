/*
import {Injectable} from "@angular/core";
import {NoteInfo} from "../model/theory/NoteInfo";

@Injectable()
export class TheoryService{

  private notes={};

  constructor(){
    let i =0;
    Object.keys(NoteInfo.frequencies).forEach(freq=>{
      let note = new NoteInfo();
      note.frequency=NoteInfo.frequencies[freq];
      note.id=freq.replace("#","i");

      note.index=i;
      console.log(note);
      this.notes[note.id]= note;
      i++;

    })
  }

  note(id:string):NoteInfo{
    return this.notes[id];
  }
}
*/
