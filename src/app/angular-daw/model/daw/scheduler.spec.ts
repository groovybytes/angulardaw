import {Scheduler} from "./Scheduler";
import {Subscription} from "rxjs/internal/Subscription";


describe('Scheduler', () => {

  let subscription: Subscription;
  let scheduler: Scheduler=new Scheduler(() => context.currentTime);
  let context = new AudioContext();

  afterEach(() => {
    if (subscription) subscription.unsubscribe();
    if (scheduler) scheduler.stop();
  });

  it('starts a time loop', (done: DoneFn) => {

    let nTicks = 10;
    let lastTime: number = -1;
    subscription = scheduler.time.subscribe(time => {
      expect(time >= lastTime).toBeTruthy();
      lastTime = time;
      if (nTicks === 0) {
        done();
      }
      nTicks--;
    });

    scheduler.start();

  });
  it('when scheduler stops no more events should be triggered', (done: DoneFn) => {

    let nTicks = 0;
    subscription  = scheduler.time.subscribe(time => {
      nTicks++;
    });

    scheduler.start();
    setTimeout(()=>{
      let currentTicks = nTicks;
      scheduler.stop();
      setTimeout(()=>{
        expect(currentTicks ===nTicks).toBeTruthy();
        done();
      },100);
    },100)

  });
});
