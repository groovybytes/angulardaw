import {Scheduler} from "./Scheduler";
import {Subscription} from "rxjs/internal/Subscription";
import {Transport} from "./Transport";
import {TimeSignature} from "../mip/TimeSignature";
import {NoteLength} from "../mip/NoteLength";


describe('Transport', () => {

  let subscription: Subscription;
  let scheduler: Scheduler = new Scheduler(() => context.currentTime);

  let context = new AudioContext();

  afterEach(() => {
    if (subscription) subscription.unsubscribe();
    if (scheduler) scheduler.stop();
  });

  it('starts a tick loop', (done: DoneFn) => {

    let nTicks = 2;
    let lastTick: number = -1;
    let transport: Transport = new Transport(scheduler, 200);
    subscription = transport.tickTock.subscribe(tick => {
      expect(lastTick === tick - 1).toBeTruthy();
      lastTick = tick;
      if (nTicks === 0) {
        transport.destroy();
        done();
      }
      nTicks--;
    });
    transport.start();

  });

  it('should reset the tick when start it called without stopping before', (done: DoneFn) => {
    let transport: Transport = new Transport(scheduler, 200);
    transport.tickStart = 0;
    transport.tickEnd = Number.MAX_VALUE;
    let currentTick: number = 0;
    let checkTick=false;
    subscription = transport.tickTock.subscribe(tick => {
      console.log(tick);
      if (checkTick) {
        expect(tick).toBe(0);
        transport.destroy();
        done();
      }
      currentTick = tick;
    });
    transport.start();
    setTimeout(() => {
      checkTick=true;
      transport.start();

    }, 200);

    transport.start();

  });

  it('triggers correct beats', (done: DoneFn) => {
    let beat = 0;
    let transport: Transport=new Transport(scheduler,200);
    transport.tickStart=0;
    transport.tickEnd=4;
    transport.tickTock.subscribe(tick =>{

    });
    transport.beat.subscribe(_beat =>{
      beat=_beat
    });
    transport.transportEnd.subscribe(()=>{
      expect(beat).toBe(0);
      transport.destroy();
      done();
    });
    transport.start();

  });

  it('loops between 2 ticks', (done: DoneFn) => {

    let nTicks = 4;
    let currentTick: number = 0;
    let transport: Transport = new Transport(scheduler, 200);
    transport.loop = true;
    transport.tickStart = 0;
    transport.tickEnd = 2;
    subscription = transport.tickTock.subscribe(tick => {
      expect(tick).toBe((currentTick % 3));
      nTicks--;
      currentTick++;
      if (nTicks == 0) {
        transport.destroy();
        done();
      }
    });
    transport.start();

  });

  it('it plays exactly 3 ticks and triggers a stop event', (done: DoneFn) => {

    let nTicks = 0;

    let transport: Transport = new Transport(scheduler, 200);
    transport.tickStart = 0;
    transport.tickEnd = 2;
    subscription = transport.tickTock.subscribe(tick => {
      nTicks++;
    });
    transport.transportEnd.subscribe(() => {
      expect(nTicks).toBe(3);
      transport.destroy();
      done();
    });
    transport.start();

  });

  it('compare ticks and beats with a narrower quantization setting', (done: DoneFn) => {

    let nTicks = 0;
    let nbeats = 0;

    let transport: Transport = new Transport(scheduler, 200);
    transport.signature=new TimeSignature(4,4);
    transport.quantization=NoteLength.Eighth;
    transport.tickStart = 0;
    transport.tickEnd = 3;
    transport.tickTock.subscribe(tick => {
      nTicks++;
    });
    transport.beat.subscribe(beat => {
      nbeats++;
    });
    transport.transportEnd.subscribe(() => {
      expect(nTicks).toBe(4);
      expect(nbeats).toBe(2);
      transport.destroy();
      done();
    });
    transport.start();

  });
});
