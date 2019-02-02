import {EventEmitter} from "@angular/core";

export class Thread {

  id: string;
  readonly message: EventEmitter<MessageEvent> = new EventEmitter();
  readonly error: EventEmitter<any> = new EventEmitter();
  private worker: Worker;
  private msgHandler;
  private errorHandler;

  constructor(id: string, private url: string) {
    this.id = id;
    this.worker = new Worker(url);
    this.msgHandler = e => this.message.emit(e);
    this.errorHandler = (error) => this.error.emit(error);
    this.worker.addEventListener('error', this.errorHandler, false);
    this.worker.addEventListener('message', this.msgHandler, false);

  }

  post(msg: any): void {
    this.worker.postMessage(msg);
  }

  destroy(): void {
    this.worker.removeEventListener("message", this.msgHandler);
    this.worker.removeEventListener("error", this.errorHandler);
    this.worker.terminate();
  }
}
