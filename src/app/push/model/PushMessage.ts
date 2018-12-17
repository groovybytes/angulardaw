export class PushMessage{
  constructor(message: string, category?: number) {
    this.message = message;
    this.category = category;
  }
  message:string;
  category:number;
}
