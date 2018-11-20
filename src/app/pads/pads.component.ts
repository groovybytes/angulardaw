import {Pad} from "../model/daw/pad/Pad";
import {WstPlugin} from "../model/daw/plugins/WstPlugin";
import {Project} from "../model/daw/Project";
import {AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, QueryList, ViewChildren} from "@angular/core";
import {NoteTrigger} from "../model/daw/NoteTrigger";


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

  constructor(private element: ElementRef, private zone: NgZone) {
  }

  ngOnInit() {


  }

  getRows(): Array<number> {
    return Array(this.rows).fill(0);
  }

  getColumns(): Array<number> {
    return Array(this.columns).fill(0);
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

  private onNoteOutStart(event:{note:string}):void{
    let wstPlugin = this.plugin as WstPlugin;
    let trigger = new NoteTrigger(null,event.note);
    wstPlugin.feed(trigger,0);
    this.project.recordNoteStart.emit(trigger);
  }
  private onNoteOutEnd():void{
    this.project.recordNoteEnd.emit();
  }

}
