import {Injectable} from "@angular/core";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {GridDto} from "../shared/api/GridDto";
import {GridCellDto} from "../shared/api/GridCellDto";
import {Pattern} from "../model/daw/Pattern";
import {ProjectsService} from "../shared/services/projects.service";

@Injectable()
export class DawGridService {

  constructor(private projectsService: ProjectsService) {

  }

  createContentCells(nRows: number, nColumns: number): Array<Array<ContentCell>> {

    let model = [];

    for (let i = 0; i < nRows; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < nColumns; j++) {

        let cell = new ContentCell(i, j);
        row.push(cell);
      }
    }

    return model;

  }

  updateEntryPositions(grid: GridDto, cellWidth: number, cellHeight: number): void {
    grid.entries.filter(entry=>entry.data).forEach(entry => {
      entry.left = entry.data.column * cellWidth;
      entry.top = entry.data.row * cellHeight;
    });
  }

  addEvent(entry: FlexyGridEntry<GridCellDto>, cellWidth: number, cellHeight: number, patterns: Array<Pattern>): void {

    let pattern = new Pattern();
    pattern.id = this.projectsService.guid();
    patterns.forEach(p => p.isBeingEdited = false);
    patterns.push(pattern);
    let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellDto(null, row, column, pattern.id);
  }

  removeEvent(entry: FlexyGridEntry<GridCellDto>,patterns:Array<Pattern>): void {
    let index = patterns.findIndex(p=>p.id===entry.data.patternId);
    patterns.splice(index,1)
   /* let entryIndex = grid.entries.findIndex(d=>d.data&& d.data.patternId===patterns[index].id);
   /!* grid.entries.splice
    patterns.splice(index,1);*!/*/
  }

  updateEvent(entry: FlexyGridEntry<GridCellDto>,cellWidth: number, cellHeight: number): void {
    entry.data.row = entry.top / cellHeight;
    entry.data.column = entry.left / cellWidth;
  }




}
