/*
import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Project} from "../../model/daw/Project";
import {TransportContext} from "../../model/daw/transport/TransportContext";
import {Pattern} from "../../model/daw/Pattern";
import {Subscription} from "rxjs/internal/Subscription";
import {AudioContextService} from "../../shared/services/audiocontext.service";
import {PatternsService} from "../../shared/services/patterns.service";
import {MusicMath} from "../../model/utils/MusicMath";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";


@Component({
  selector: 'recorder',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecorderComponent implements OnInit, OnDestroy {

  @Input() project: Project;

  private metronomeTransport: TransportContext;
  private pattern: Pattern;
  private patternSubscription: Subscription;
  private recordTime: number;

  private recordingEvents: Array<{ note: NoteEvent, event: DeviceEvent<any>, updater: any }> = [];

  constructor(private audioContext: AudioContextService, private patternsService: PatternsService) {
    /!* this.subscriptions.push(project.inputDevice.noteStart.subscribe(event => this.recordNoteStart(event)));
     this.subscriptions.push(project.inputDevice.noteEnd.subscribe(() => this.recordNoteEnd()));*!/
  }

  ngOnInit() {
    this.metronomeTransport = this.project.metronomePattern.transportContext;

    this.project.deviceEvents.subscribe((deviceEvent: DeviceEvent<any>) => {

      if (this.project.recording.getValue() === true) {
        if (deviceEvent.category === EventCategory.NOTE_ON) {
          let event = deviceEvent.data as NoteOnEvent;
          let noteEvent = NoteEvent.default(event.note);
          noteEvent.time = this.recordTime * 1000;
          noteEvent.length = 0;
          noteEvent.loudness = 1;

          if (this.pattern.insertNote(noteEvent, true)) {
            let updater = setInterval(() => {
              noteEvent.length = this.recordTime * 1000 - noteEvent.time;
              this.pattern.noteUpdated.emit(noteEvent);
            }, 50);
            this.recordingEvents.push({event: deviceEvent, note: noteEvent, updater: updater});
          } else console.log("cant insert note");

        } else if (deviceEvent.category === EventCategory.NOTE_OFF) {
          let noteOffEvent = deviceEvent.data as NoteOffEvent;
          let index = this.recordingEvents
            .findIndex(event =>
              event.note.note === noteOffEvent.note && event.event.deviceId === deviceEvent.deviceId);
          if (index >= 0) {
            this.recordingEvents[index].note.length = this.recordTime * 1000 - this.recordingEvents[index].note.time;
            this.pattern.noteUpdated.emit(this.recordingEvents[index].note);
            clearInterval(this.recordingEvents[index].updater);
            this.recordingEvents.splice(index, 1);
          }


        }
      }
    });

    /!*this.project.recording.subscribe((isRecording) => {
      if (isRecording) {
        this.project.setChannels([]);
        this.project.start();
        this.pattern = this.project.recordSession.pattern;
        let metronomeSubscription = this.metronomeTransport.time.subscribe(event => {

          if (event != null) {
            let bar = MusicMath.getBarNumber(
              event.value * 1000,
              this.metronomeTransport.settings.global.bpm,
              this.project.metronomePattern.quantization.getValue(),
              new TimeSignature(this.metronomeTransport.settings.global.beatUnit, this.metronomeTransport.settings.global.barUnit));
            if (bar === 1) {
              metronomeSubscription.unsubscribe();
              this.pattern.stream.setTimeOffset(event.value);
              this.project.addChannel(this.pattern.id);
              let patternTime = MusicMath.getEndTime(this.pattern.transportContext.settings.loopEnd, this.pattern.transportContext.settings.global.bpm) / 1000;
              this.patternSubscription = this.pattern.transportContext.time.subscribe(event => {
                this.recordTime = (event.value - this.pattern.stream.transportTimeOffset) % patternTime;
              });
              // this.patternsService.stopAndClear(this.project);
              //this.patternsService.togglePattern(this.pattern.id, this.project);

              //this.project.transport.resetStartTime();
              /!* *!/
            }

          }

        });
      }
      else if (isRecording === false) {

        this.patternsService.stopAndClear(this.project);
        this.patternSubscription.unsubscribe();
      }


    });*!/

  }

/!*
  start(pattern: Pattern): void {
    this.patternsService.togglePattern(pattern.id, this.project);
  }
*!/


  ngOnDestroy(): void {
  }


}
*/
