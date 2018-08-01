import {Sample} from "../Sample";
import {CompoundInstrument} from "../../mip/instruments/CompoundInstrument";
import {Instrument} from "../../mip/instruments/Instrument";


export class Drums implements Instrument{

  private triggers:Array<{note:string,sample:Sample}>=[];

  addTrigger(note:string,sample:Sample):void{
    this.triggers.push({note:note,sample:sample});
  }

  play(note: string): void {
    let trigger = this.triggers.find(trigger=>trigger.note===note);
    trigger.sample.trigger();
  }

  getName(): string {
    return "";
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
