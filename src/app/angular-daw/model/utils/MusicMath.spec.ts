import {MusicMath} from "./MusicMath";
import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";


describe('MusicMath', () => {


  it('getTickTime', () => {
    expect(MusicMath.getTickTime(120, NoteLength.Whole)===2000).toBeTruthy();
    expect(MusicMath.getTickTime(120, NoteLength.Quarter)===500).toBeTruthy();
  });

  it('getTickFor', () => {
    expect(MusicMath.getTickFor(0,1,new TimeSignature(4,4))).toBe(4);
  });

  it('getBeatNumber', () => {
    expect(MusicMath.getBeatNumber(0,new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBeatNumber(1,new TimeSignature(4,4))).toBe(1);
    expect(MusicMath.getBeatNumber(2,new TimeSignature(4,4))).toBe(2);
    expect(MusicMath.getBeatNumber(3,new TimeSignature(4,4))).toBe(3);
    expect(MusicMath.getBeatNumber(4,new TimeSignature(4,4))).toBe(0);

/*    expect(MusicMath.getBeatNumber(8,new TimeSignature(4,4))).toBe(2);
    expect(MusicMath.getBeatNumber(16,new TimeSignature(4,4))).toBe(3);
    expect(MusicMath.getBeatNumber(20,new TimeSignature(4,4))).toBe(4);
    expect(MusicMath.getBeatNumber(20,new TimeSignature(3,4))).toBe(0);*/
  });

});
