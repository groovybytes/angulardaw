import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  NgZone, OnChanges,
  OnInit,
  Output,
  QueryList, SimpleChanges,
  ViewChildren
} from '@angular/core';
import {Notes} from "../../model/mip/Notes";
import {Pad} from "../model/Pad";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {Push} from "../model/Push";
import {PushMatrixService} from "./push-matrix.service";

@Component({
  selector: 'push-matrix',
  templateUrl: './push-matrix.component.html',
  styleUrls: ['./push-matrix.component.scss']
})
export class PushMatrixComponent implements OnInit, AfterViewInit,OnChanges {


  @ViewChildren('padElement') padElements: QueryList<ElementRef>;

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    this.pushMatrixService.onKeyUp(event);
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    this.pushMatrixService.onKeyDown(event);
  }
  @HostListener('mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    this.pushMatrixService.onMouseDown(event);
  }
  @HostListener('mouseup', ['$event'])
  mouseUpEvent(event: MouseEvent) {
    this.pushMatrixService.onMouseUp(event);
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

  getKeyBinding(pad:Pad):string{
    let binding = this.push.getKeyBinding(pad);
    return binding?binding.key:null;
  }

  ngAfterViewInit(): void {
   /* this.padElements.forEach(element => {
      this.zone.runOutsideAngular(() => {
        $(element.nativeElement).on("mousedown", () => this.pushMatrixService.onMouseDown(element));
        $(element.nativeElement).on("mouseup", () => this.pushMatrixService.onMouseUp(element));
      });
    });*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }


}
