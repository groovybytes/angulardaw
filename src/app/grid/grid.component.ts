import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {System} from "../system/System";
import {PluginId} from "../model/daw/plugins/PluginId";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {GridComponentService} from "./grid.component.service";
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";
import {GridCellViewModel} from "../model/viewmodel/GridCellViewModel";

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() project: ProjectViewModel;
  instruments: Array<string> = Object.keys(PluginId);

  @Input() cellWidth: number;
  @Input() cellHeight: number;
  @Output() focusedPatternChanged: EventEmitter<PatternViewModel> = new EventEmitter();

  constructor(private gridComponentService: GridComponentService,
              private system: System) {
  }

  ngOnInit() {
    let pattern = this.project.patterns.find(p => p.isBeingEdited);
    if (pattern) this.focusedPatternChanged.emit(pattern);
  }

 /* selectInstrument(instr: string, column: any): void {
   // this.gridComponentService.selectInstrument(instr, column, this.projectViewModel).catch(error => this.system.error(error));
  }

  onCellClicked(cell: GridCellDto): void {
    this.gridComponentService.onCellClicked(cell, this.projectViewModel);

  }

  onCellDblClicked(cell: GridCellDto): void {
    this.gridComponentService.onCellDblClicked(cell, this.projectViewModel, this.focusedPatternChanged);

  }

  getPattern(id): Pattern {
    return this.projectViewModel.patterns.find(p => p.id === id);
  }

  getCell(row: number, column: number): GridCellDto {
    let index = row * this.projectViewModel.grid.nColumns + column;
    return this.projectViewModel.grid.cells[index];
  }

  getRows(): Array<any> {
    return Array(this.projectViewModel.grid.nRows).fill(0);
  }

  getColumns(): Array<any> {
    return Array(this.projectViewModel.grid.nColumns).fill(0);
  }*/

}
