import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Notes} from "../../model/mip/Notes";
import {PadInfo} from "./model/PadInfo";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";

@Component({
  selector: 'push-matrix',
  templateUrl: './push-matrix.component.html',
  styleUrls: ['./push-matrix.component.scss']
})
export class PushMatrixComponent implements OnInit, AfterViewInit {

  pads: Array<PadInfo> = [];
  @Input() size: number = 8;
  @Input() baseNote: string = "C0";
  @Input() deviceId: string = "push";

  @ViewChildren('padElement') padElements: QueryList<ElementRef>;
  public listenToKeyboard: boolean = false;
  public padKeyTarget: PadInfo;

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.padKeyTarget) {
      this.padKeyTarget.keyBinding = String.fromCharCode(event.keyCode);
      this.padKeyTarget = null;
    } else if (this.listenToKeyboard) {
      let pad = this.pads.find(pad => this.keyEquals(event.keyCode, pad.keyBinding));
      console.log("stop " + pad.note);

      this.deviceEvent
        .emit(
          new DeviceEvent<NoteOffEvent>(this.deviceId,EventCategory.NOTE_OFF,
            NoteOffEvent.default(pad.note)));
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {

    if (this.listenToKeyboard && !this.padKeyTarget && !event.repeat) {
      let pad = this.pads.find(pad => this.keyEquals(event.keyCode, pad.keyBinding));
      if (pad) {
        this.deviceEvent
          .emit(new DeviceEvent<NoteOnEvent>(this.deviceId,
            EventCategory.NOTE_ON,
            NoteOnEvent.default(pad.note)))
      }
    }
  }

  @Output() deviceEvent: EventEmitter<DeviceEvent<any>> = new EventEmitter();

  constructor(private element: ElementRef, private zone: NgZone, @Inject("Notes") private noteInfo: Notes) {
  }

  private keyEquals(eventKey: number, stringCode: string): boolean {
    return String.fromCharCode(eventKey).toLowerCase() === stringCode.toLowerCase();
  }

  ngOnInit() {
    let startNote = this.noteInfo.getNote(this.baseNote);
    let endNote = this.noteInfo.getNoteByIndex((startNote.index - 1) + this.size * this.size);

    this.noteInfo.getNoteRange(startNote.id, endNote.id).forEach((note, i) => {
      let row = (this.size - Math.ceil((i + 1) / this.size)) + 1;
      let column = (i % this.size) + 1;
      this.pads.push(new PadInfo(note, row, column, null));
    });

  }

  ngAfterViewInit(): void {
    this.padElements.forEach(element => {
      this.zone.runOutsideAngular(() => {
        $(element.nativeElement).on("mousedown", () => {
          let note = $(element.nativeElement).attr("data-note");
          this.deviceEvent.emit(new DeviceEvent<NoteOnEvent>(this.deviceId, EventCategory.NOTE_ON,
            NoteOnEvent.default(note)));

        });
        $(element.nativeElement).on("mouseup", () => {
          let note = $(element.nativeElement).attr("data-note");
          this.deviceEvent.emit(new DeviceEvent<NoteOffEvent>(this.deviceId, EventCategory.NOTE_OFF,
            NoteOffEvent.default(note)));

        })
      });
    });
  }

  learnKey(pad: PadInfo): void {
    if (!this.padKeyTarget) {
      this.padKeyTarget = pad;
    } else if (this.padKeyTarget.note === pad.note) {
      this.padKeyTarget = null;
    } else {
      this.padKeyTarget = pad;
    }

  }

}
