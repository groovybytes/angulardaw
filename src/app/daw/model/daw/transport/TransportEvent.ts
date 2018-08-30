export class TransportEvent<T> {


  constructor(channel: string, value?: T) {
    this.channel = channel;
    this.value = value;
  }

  channel: string;
  value: T;

}
