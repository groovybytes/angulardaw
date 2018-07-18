import {Scheduler} from "./Scheduler";
import {Subscription} from "rxjs/internal/Subscription";
import {Transport} from "./Transport";


describe('Transport', () => {

  let subscription: Subscription;
  let scheduler: Scheduler=new Scheduler(() => context.currentTime);

  let context = new AudioContext();

  afterEach(() => {
    if (subscription) subscription.unsubscribe();
    if (scheduler) scheduler.stop();
  });

  it('starts a tick loop', (done: DoneFn) => {

    let nTicks = 2;
    let lastTick: number = -1;
    let transport: Transport=new Transport(scheduler,120);
    subscription = transport.tickTock.subscribe(tick => {
      expect(lastTick===tick-1).toBeTruthy();
      lastTick = tick;
      if (nTicks === 0) {
        done();
      }
      nTicks--;
    });
    transport.start();

  });

  it('loops between 2 ticks', (done: DoneFn) => {

    let nTicks = 2;
    let lastTick: number = -1;
    let transport: Transport=new Transport(scheduler,120);
    transport.loop=true;
    transport.tickStart=5;
    transport.tickEnd=10;
    subscription = transport.tickTock.subscribe(tick => {
      expect(lastTick===tick-1).toBeTruthy();
      lastTick = tick;
      if (nTicks === 0) {
        done();
      }
      nTicks--;
    });
    transport.start();

  });
});
