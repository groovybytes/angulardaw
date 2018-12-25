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
import {Project} from "../../model/daw/Project";
import {TriggerInfo} from "../../model/daw/pad/TriggerInfo";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";


@Component({
  selector: 'pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss']
})
export class PadsComponent implements OnInit, AfterViewInit {

  @Input() rows: number;
  @Input() columns: number;
  @Input() pad: Pad;
  @Input() plugin: AudioPlugin;
  @Input() project: Project;
  @ViewChildren('trigger') triggers: QueryList<ElementRef>;

  public listenToKeyboard: boolean = false;
  public keyToLearnTarget: TriggerInfo;

   padTriggers: Array<TriggerInfo>;
  private nodes:Array<{node:AudioBufferSourceNode,note:string}>=[];


  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.keyToLearnTarget){
      this.keyToLearnTarget.key=String.fromCharCode(event.keyCode);
      this.keyToLearnTarget=null;
    }
    else if (this.listenToKeyboard) {
      let trigger = this.padTriggers.find(trigger => this.keyEquals(event.keyCode,trigger.key));
      console.log("stop " + trigger.note);
      this.onNoteOutEnd(trigger.note);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {

    if (this.listenToKeyboard && !this.keyToLearnTarget && !event.repeat) {
      let trigger = this.padTriggers.find(trigger => this.keyEquals(event.keyCode,trigger.key));
      if (trigger) {
        console.log("play " + trigger.note);
        let index = this.nodes.findIndex(node=>node.note===trigger.note);
        if (index===-1)  this.onNoteOutStart({note: trigger.note});
        else console.log("blocked!");
      }
    }
  }

  constructor(private element: ElementRef, private zone: NgZone) {
  }

  private keyEquals(eventKey:number,stringCode:string):boolean{
    return String.fromCharCode(eventKey).toLowerCase()===stringCode.toLowerCase();
  }
  ngOnInit() {
    if (this.pad){
      this.padTriggers = [].concat.apply([], this.pad.grid);
    }
    else{

    }

  }

 /* getRows(): Array<number> {
    return Array(this.rows).fill(0);
  }

  getColumns(): Array<number> {
    return Array(this.columns).fill(0);
  }*/

  getKeyString(code): string {
    return code;//String.fromCharCode(code);
  }

  ngAfterViewInit(): void {
    this.setupEventHandlers();
    this.triggers.changes.subscribe(t => {
      this.setupEventHandlers();
    })
  }

  private setupEventHandlers(): void {

    this.triggers.forEach(element => {
      this.zone.runOutsideAngular(() => {
        $(element.nativeElement).on("mousedown", () => {
          this.onNoteOutStart({note: $(element.nativeElement).attr("data-note")});
        });
        $(element.nativeElement).on("mouseup", () => {
          this.onNoteOutEnd($(element.nativeElement).attr("data-note"));
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

  }

  private onNoteOutEnd(note:string): void {

  }

}
