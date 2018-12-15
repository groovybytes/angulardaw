import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import {Pad} from "../../model/daw/pad/Pad";
import {WstPlugin} from "../../model/daw/plugins/WstPlugin";
import {Project} from "../../model/daw/Project";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import {TriggerInfo} from "../../model/daw/pad/TriggerInfo";


@Component({
  selector: 'pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss']
})
export class PadsComponent implements OnInit, AfterViewInit {

  @Input() rows: number;
  @Input() columns: number;
  @Input() pad: Pad;
  @Input() plugin: WstPlugin;
  @Input() project: Project;
  @ViewChildren('trigger') triggers: QueryList<ElementRef>;

  public size: number = 0;
  public listenToKeyboard: boolean = false;
  public keyToLearnTarget: TriggerInfo;

  private padTriggers: Array<TriggerInfo>;
  private currentNote:string;


  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.keyToLearnTarget){
      this.keyToLearnTarget.key=event.keyCode;
      this.keyToLearnTarget=null;
    }
    else if (this.listenToKeyboard) {
      this.onNoteOutEnd();
    }
    this.currentNote=null;
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (this.listenToKeyboard && !this.keyToLearnTarget) {
      let trigger = this.padTriggers.find(trigger => trigger.key === event.keyCode);
      if (trigger) {
        this.currentNote=trigger.note;
        this.onNoteOutStart({note: trigger.note});
      }
    }
  }

  constructor(private element: ElementRef, private zone: NgZone) {
  }

  ngOnInit() {
    this.padTriggers = [].concat.apply([], this.pad.grid);
  }

  getRows(): Array<number> {
    return Array(this.rows).fill(0);
  }

  getColumns(): Array<number> {
    return Array(this.columns).fill(0);
  }

  getKeyString(code): string {
    return String.fromCharCode(code);
  }

  ngAfterViewInit(): void {
    this.setupEventHandlers();
    this.triggers.changes.subscribe(t => {
      this.setupEventHandlers();
    })
  }

  increaseSize(): void {
    if (this.size < 1) this.size++;

  }

  decreaseSize(): void {
    if (this.size > 0) this.size--;
  }

  private setupEventHandlers(): void {

    this.triggers.forEach(element => {
      this.zone.runOutsideAngular(() => {
        $(element.nativeElement).on("mousedown", () => {
          this.onNoteOutStart({note: $(element.nativeElement).attr("data-note")});
        });
        $(element.nativeElement).on("mouseup", () => {
          this.onNoteOutEnd();
        })
      });
    });
  }

  learnKey(triggerInfo: TriggerInfo): void {
    if (!this.keyToLearnTarget) {
      this.keyToLearnTarget = triggerInfo;
    } else if (this.keyToLearnTarget.note === triggerInfo.note) {
      this.keyToLearnTarget = null;
    } else {
      this.keyToLearnTarget = triggerInfo;
    }

  }

  private onNoteOutStart(event: { note: string }): void {
    let wstPlugin = this.plugin as WstPlugin;
    let trigger = new NoteTrigger(null, event.note);
    this.currentNote=event.note;
    wstPlugin.feed(trigger, 0);
    this.project.recordNoteStart.emit(trigger);
  }

  private onNoteOutEnd(): void {
    this.currentNote=null;
    this.project.recordNoteEnd.emit();
  }

}
