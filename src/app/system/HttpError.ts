export class HttpError{
  constructor(url: string, reason: any) {
    this.url = url;
    this.reason = reason;
  }
  url:string;
  reason:any;
}
