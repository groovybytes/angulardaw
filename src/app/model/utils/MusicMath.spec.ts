import {MusicMath} from "./MusicMath";
import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";


describe('MusicMath', () => {


  it('getTickTime', () => {
    expect(MusicMath.getTickTime(120, NoteLength.Whole)===2000).toBeTruthy();
    expect(MusicMath.getTickTime(120, NoteLength.Quarter)===500).toBeTruthy();
  });

  it('getTickFor', () => {
    expect(MusicMath.getTickFor(0,1,NoteLength.Quarter, new TimeSignature(4,4))).toBe(4);
    expect(MusicMath.getTickFor(0,1,NoteLength.Eighth, new TimeSignature(4,4))).toBe(8);
    expect(MusicMath.getTickFor(1,1,NoteLength.Eighth, new TimeSignature(4,4))).toBe(10);
  });

  it('getBeatTicks', () => {
    expect(MusicMath.getBeatTicks(NoteLength.Quarter)).toBe(1);
    expect(MusicMath.getBeatTicks(NoteLength.Eighth)).toBe(2);
    expect(MusicMath.getBeatTicks(NoteLength.EighthTriplet)).toBe(3);
  });

  it('getBeatNumber', () => {
    expect(MusicMath.getBeatNumber(0,NoteLength.Quarter, new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBeatNumber(1,NoteLength.Quarter,new TimeSignature(4,4))).toBe(1);
    expect(MusicMath.getBeatNumber(2,NoteLength.Quarter,new TimeSignature(4,4))).toBe(2);
    expect(MusicMath.getBeatNumber(3,NoteLength.Quarter,new TimeSignature(4,4))).toBe(3);
    expect(MusicMath.getBeatNumber(4,NoteLength.Quarter,new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBeatNumber(4,NoteLength.Quarter,new TimeSignature(3,4))).toBe(1);
    expect(MusicMath.getBeatNumber(4,NoteLength.Eighth,new TimeSignature(4,4))).toBe(2);
  });
  it('getBeatNumber:not a beat!', () => {
    expect(MusicMath.getBeatNumber(1,NoteLength.Eighth, new TimeSignature(4,4))).toBe(-1);
  });


  it('getBarNumber', () => {
    expect(MusicMath.getBarNumber(0,NoteLength.Quarter, new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBarNumber(4,NoteLength.Quarter, new TimeSignature(4,4))).toBe(1);
    expect(MusicMath.getBarNumber(3,NoteLength.Quarter, new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBarNumber(3,NoteLength.Quarter, new TimeSignature(3,4))).toBe(1);
    expect(MusicMath.getBarNumber(4,NoteLength.Eighth, new TimeSignature(4,4))).toBe(0);
    expect(MusicMath.getBarNumber(6,NoteLength.Quarter, new TimeSignature(4,4))).toBe(1);
  });

});
