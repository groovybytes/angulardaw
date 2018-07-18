export class TrackEvent<T> {
  constructor(trackTime:number,data: T) {
    this.data = data;
    this.trackTime=trackTime;
  }

  trackTime: number;
  data: T;
}
