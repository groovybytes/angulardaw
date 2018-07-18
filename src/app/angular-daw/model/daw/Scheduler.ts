import {Subject} from 'rxjs';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

export class Scheduler {

  time: Observable<number> = new Observable<number>();
  private timeSubject: Subject<number> = new Subject<number>();

  private intervalHandle: any;
  private startOffset: number;

  constructor(private getTime: () => number) {
    this.time = this.timeSubject.asObservable();
  }


  getSysTime(): number {
    return this.getTime();
  }

  start(): void {
    if (this.intervalHandle) this.stop();
    let timeStamp = 0;
    let offset = 0;

    this.intervalHandle = setInterval(() => {
      if (!this.startOffset) this.startOffset = this.getTime();
      let newTime = this.getTime() - this.startOffset;
      offset = (newTime - timeStamp) * 1000;
      this.timeSubject.next(newTime);
    }, 1);

  }

  stop(): void {
    clearInterval(this.intervalHandle);
  }

  destroy(): void {
    this.stop();
  }

}
