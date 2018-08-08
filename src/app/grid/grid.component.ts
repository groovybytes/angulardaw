import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {System} from "../system/System";
import {PluginId} from "../model/daw/plugins/PluginId";
import {Pattern} from "../model/daw/Pattern";
import {GridComponentService} from "./grid.component.service";
import {ProjectDto} from "../shared/api/ProjectDto";
import {GridCellDto} from "../shared/api/GridCellDto";

@Component({
  selector: 'daw-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() project: ProjectDto;
  @Output() editPattern: EventEmitter<Pattern> = new EventEmitter();
  instruments: Array<string> = Object.keys(PluginId);

  constructor(private gridComponentService: GridComponentService,
              private system: System) {
  }

  ngOnInit() {

  }

  selectInstrument(instr: string, column: any): void {
    //this.gridComponentService.selectInstrument(instr, column, this.project).catch(error => this.system.error(error));
  }

  onCellClicked(cell: GridCellDto): void {

    if (cell.patternId){
      cell.patternId=null;
    }
    else{
      let pattern = new Pattern();
      this.project.patterns.push(pattern);
      setTimeout(()=>{
        cell.patternId=pattern.id;
      })
    }

  }

  getCell(row: number, column: number): GridCellDto {
    let index = row * this.project.grid.nColumns + column;
    return this.project.grid.cells[index];
  }

  getRows(): Array<any> {
    return Array(this.project.grid.nRows).fill(0);
  }

  getColumns(): Array<any> {
    return Array(this.project.grid.nColumns).fill(0);
  }

}
