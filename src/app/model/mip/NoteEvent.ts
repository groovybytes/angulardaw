

export class NoteEvent{
  readonly id: string;
  time: number;
  note: string;
  length: number;
  loudness: number;
  articulation: number;


  constructor(note: string,time?: number, length?: number, loudness?: number, articulation?: number) {
    this.id = this.guid();
    this.time = time;
    this.note = note;
    this.length = length;
    this.loudness = loudness;
    this.articulation = articulation;
  }

  static default(note:string):NoteEvent{
    return new NoteEvent(note);
  }

  private  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



}
