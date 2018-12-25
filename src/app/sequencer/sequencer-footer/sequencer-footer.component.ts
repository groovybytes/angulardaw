import {Component, Input, OnInit} from '@angular/core';
import {Pattern} from "../../model/daw/Pattern";
import {NoteLength} from "../../model/mip/NoteLength";
import {Project} from "../../model/daw/Project";
import {PatternsService} from "../../shared/services/patterns.service";
import {A2dClientService,WindowParams} from "angular2-desktop";

@Component({
  selector: 'sequencer-footer',
  templateUrl: './sequencer-footer.component.html',
  styleUrls: ['./sequencer-footer.component.scss']
})
export class SequencerFooterComponent implements OnInit {

  @Input() pattern: Pattern;
  @Input() project: Project;

  constructor(private patternsService: PatternsService,private desktop:A2dClientService) {
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

  openPads():void{
   /* let params = new WindowParams(
      null,
      100,
      100,
      200,
      200,
      {project:this.project},null
    );

    this.project.selectedTrack.getValue()?.plugins[0].getInfo().pad

    let windowId = this.desktop.createWindow("pads",params);
    this.desktop.openWindow(windowId);*/
  }


}
