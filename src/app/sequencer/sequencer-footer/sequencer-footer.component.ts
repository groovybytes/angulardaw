import {Component, Input, OnInit} from '@angular/core';
import {Pattern} from "../../model/daw/Pattern";
import {NoteLength} from "../../model/mip/NoteLength";
import {Project} from "../../model/daw/Project";
import {PatternsService} from "../../shared/services/patterns.service";

@Component({
  selector: 'sequencer-footer',
  templateUrl: './sequencer-footer.component.html',
  styleUrls: ['./sequencer-footer.component.scss']
})
export class SequencerFooterComponent implements OnInit {

  @Input() pattern: Pattern;
  @Input() project: Project;

  constructor(private patternsService: PatternsService) {
  }

  ngOnInit() {
  }

  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }


  toggleClip(): void {
    this.patternsService.togglePattern(this.pattern.id, this.project);
  }

  changeQuantization(value: NoteLength): void {
    this.pattern.quantization.next(value);
  }

  noteLengthSelected(value: NoteLength): void {
    console.log(value);
  }

  toggleRecord(): void {
    this.project.record.emit(this.pattern);
  }


}
