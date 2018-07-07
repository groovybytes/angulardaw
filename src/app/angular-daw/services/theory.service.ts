/*
import {Injectable} from "@angular/core";
import {Note} from "../model/theory/Note";

@Injectable()
export class TheoryService{

  private notes={};

  constructor(){
    let i =0;
    Object.keys(Note.frequencies).forEach(freq=>{
      let note = new Note();
      note.frequency=Note.frequencies[freq];
      note.id=freq.replace("#","i");

      note.index=i;
      console.log(note);
      this.notes[note.id]= note;
      i++;

    })
  }

  note(id:string):Note{
    return this.notes[id];
  }
}
*/
