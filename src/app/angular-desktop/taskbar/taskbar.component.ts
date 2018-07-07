/*
import {
  Component, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output
} from "@angular/core";

import {Taskbar} from "./Taskbar";
import {TaskbarEntry} from "./TaskbarEntry";


@Component({
  selector: 'taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})

export class TaskbarComponent implements OnInit, OnDestroy {

  @Input() model: Taskbar;
  @Output() entryClicked: EventEmitter<TaskbarEntry> = new EventEmitter<TaskbarEntry>();

  constructor() {

  }

  ngOnInit() {


  }

  onEntryClicked(entry: TaskbarEntry): void {
    this.entryClicked.emit(entry);
  }

  ngOnDestroy(): void {

  }

}
*/
