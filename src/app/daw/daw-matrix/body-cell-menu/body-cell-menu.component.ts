import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Pattern} from "../../model/daw/Pattern";
import {PatternsService} from "../../shared/services/patterns.service";
import {Project} from "../../model/daw/Project";
import {Cell} from "../../model/daw/matrix/Cell";

@Component({
  selector: 'body-cell-menu',
  templateUrl: './body-cell-menu.component.html',
  styleUrls: ['./body-cell-menu.component.scss']
})
export class BodyCellMenuComponent implements OnInit {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() color: string;

 /* @HostBinding('style.left') left: string="100px";*/


  constructor(private patternsService: PatternsService) {
  }

  ngOnInit() {
  }

  remove(): void {
    /*this.patternsService.removePattern(this.project, this.cell.data.id);
    this.cell.data=null;*/
  }
}

