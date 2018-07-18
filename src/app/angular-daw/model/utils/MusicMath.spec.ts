import {MusicMath} from "./MusicMath";
import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";


describe('MusicMath', () => {


  it('getTickTime', () => {
    expect(MusicMath.getTickTime(120, NoteLength.Whole)===2000).toBeTruthy();
    expect(MusicMath.getTickTime(120, NoteLength.Quarter)===500).toBeTruthy();
  });

  it('getTickFor', () => {
    expect(MusicMath.getTickFor(0,1,new TimeSignature(4,4))===5).toBeTruthy();
  });

});
