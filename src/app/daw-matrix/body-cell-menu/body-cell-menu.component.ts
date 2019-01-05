import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Pattern} from "../../model/daw/Pattern";
import {DawMatrixService} from "../daw-matrix.service";
import {Cell} from "../../model/daw/matrix/Cell";


@Component({
  selector: 'body-cell-menu',
  templateUrl: './body-cell-menu.component.html',
  styleUrls: ['./body-cell-menu.component.scss']
})
export class BodyCellMenuComponent implements OnInit {

  @Input() cell: Cell<Pattern>;
  @Input() color: string;

   @HostBinding('style.display')
   get display() {
     return this.cell.patternMenu?"":"none";
   }


  constructor(private dawMatrixService: DawMatrixService) {
  }

  ngOnInit() {
  }


/*  removeRow(row: number): void {
    this.dawMatrixService.removePatternsFromRow(this.project, row);
  }*/

  remove(): void {
    this.dawMatrixService.removePattern(this.cell.patternMenu.id);
    this.cell.patternMenu=null;
  }
}

