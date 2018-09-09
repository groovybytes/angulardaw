import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {WstPlugin} from "../../model/daw/plugins/WstPlugin";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import {Pattern} from "../../model/daw/Pattern";
import {TriggerInfo} from "../../model/daw/pad/TriggerInfo";
import {Pad} from "../../model/daw/pad/Pad";

@Component({
  selector: 'pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss']
})
export class PadsComponent implements OnInit, AfterViewInit {

  @Input() rows: number;
  @Input() columns: number;
  @Input() pattern: Pattern;
  @Input() pad: Pad;

  @Output() noteStart: EventEmitter<{ note: string, pattern: Pattern }> = new EventEmitter();
  @Output() noteEnd: EventEmitter<void> = new EventEmitter();

  @ViewChildren('trigger') triggers: QueryList<ElementRef>;

  public size: number = 1;

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
          this.noteStart.emit({note: $(element.nativeElement).attr("data-note"), pattern: this.pattern});
        });
        $(element.nativeElement).on("mouseup", () => {
          this.noteEnd.emit();
        })
      });
    });


  }

}
