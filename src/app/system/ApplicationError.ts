export class ApplicationError {
  constructor(data: any) {
    this.data = data;
  }
  timeStamp: number;
  data: any;
  userMessage:string;
}
