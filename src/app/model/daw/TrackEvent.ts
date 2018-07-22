export class TrackEvent<T> {
  constructor(time:number,data: T) {
    this.data = data;
    this.time=time;
  }
  time: number;
  data: T;
}
