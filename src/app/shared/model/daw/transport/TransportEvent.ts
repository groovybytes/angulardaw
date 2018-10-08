export class TransportEvent<T> {


  constructor(channels: Array<string>, value?: T) {
    this.channels = channels;
    this.value = value;
  }

  channels: Array<string>;
  value: T;

}
