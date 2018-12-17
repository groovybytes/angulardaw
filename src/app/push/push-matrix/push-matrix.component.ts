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
import {Push} from "../model/Push";
import {PushMatrixService} from "./push-matrix.service";

@Component({
  selector: 'push-matrix',
  templateUrl: './push-matrix.component.html',
  styleUrls: ['./push-matrix.component.scss']
})
export class PushMatrixComponent implements OnInit, AfterViewInit {


  @ViewChildren('padElement') padElements: QueryList<ElementRef>;
  public padKeyTarget: PadInfo;

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    this.pushMatrixService.onKeyUp(event);
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    this.pushMatrixService.onKeyDown(event);
  }

  @Output() deviceEvent: EventEmitter<DeviceEvent<any>> = new EventEmitter();

  constructor(
    private element: ElementRef,
    private zone: NgZone,
    private pushMatrixService: PushMatrixService,
    @Inject("Push") public push: Push,
    @Inject("Notes") private noteInfo: Notes) {
  }


  ngOnInit() {


  }

  ngAfterViewInit(): void {
    this.padElements.forEach(element => {
      this.zone.runOutsideAngular(() => {
        $(element.nativeElement).on("mousedown", () => this.pushMatrixService.onMouseDown(element));
        $(element.nativeElement).on("mouseup", () => this.pushMatrixService.onMouseUp(element));
      });
    });
  }

}
