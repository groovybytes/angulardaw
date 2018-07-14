import {Sample} from "./Sample";
import {Playable} from "./Playable";
import {Note} from "./theory/Note";
import {Dynamics} from "./theory/Dynamics";

export class Instrument implements Playable {

  id: string;
  samples: Array<Sample>;
  startNote: string;
  endNote: string;

  play(when: number, duration: number, notes: Array<Note>,dynamics:Dynamics) {
    notes.forEach(note=>{
      let sample = this.getSampleForNote(note);
      sample.play(when,duration,[note],dynamics);
    });
  }

  closest(array:Array<number>, num) {
    var i = 0;
    var minDiff = 1000;
    var ans;
    array.forEach(()=>{
      var m = Math.abs(num - array[i]);
      if (m < minDiff) {
        minDiff = m;
        ans = array[i];
      }
      i++;
    })
    return ans;
  }

  getSampleForNote(note:Note):Sample{
    let closestSampleByNote= this.closest(this.samples.map(sample=>sample.baseNote.index),note.index);
    return this.samples.filter(sample=>sample.baseNote.index===closestSampleByNote)[0];
  }

  public trigger() {
   this.samples[0].trigger();
  }

}
