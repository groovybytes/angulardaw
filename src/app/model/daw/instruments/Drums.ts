import {Sample} from "../Sample";
import {Instrument} from "../../mip/instruments/Instrument";
import {Instruments} from "./Instruments";


export class Drums implements Instrument{

  private triggers:Array<{note:string,sample:Sample}>=[];

  addTrigger(note:string,sample:Sample):void{
    this.triggers.push({note:note,sample:sample});
  }

  getNotes():Array<string>{
    return this.triggers.map(t=>t.note);
  }

  play(note: string): void {
    let trigger = this.triggers.find(trigger=>trigger.note===note);
    trigger.sample.trigger();
  }

  getId(): Instruments {
    return Instruments.DRUMKIT1;
  }

  /*private chooseSample(note: NoteInfo): Sample {
    let closestSampleByNote = this.closest(this.triggers.map(trigger => trigger.note.index), note.index);
    return this.triggers.filter(trigger => trigger.note.index === closestSampleByNote)[0].sample;
  }

  private closest(array: Array<number>, num) {
    var i = 0;
    var minDiff = 1000;
    var ans;
    array.forEach(() => {
      var m = Math.abs(num - array[i]);
      if (m < minDiff) {
        minDiff = m;
        ans = array[i];
      }
      i++;
    })
    return ans;
  }*/



}
