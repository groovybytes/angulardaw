import {Injectable} from "@angular/core";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {GridDto} from "../shared/api/GridDto";
import {GridCellDto} from "../shared/api/GridCellDto";
import {NoteTriggerDto} from "../shared/api/NoteTriggerDto";
import {Pattern} from "../model/daw/Pattern";
import {TransportParams} from "../model/daw/TransportParams";
import {MusicMath} from "../model/utils/MusicMath";
import {NoteLength} from "../model/mip/NoteLength";
import {Loudness} from "../model/mip/Loudness";
import {ProjectsService} from "../shared/services/projects.service";
import {ProjectDto} from "../shared/api/ProjectDto";

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

  createEntries(grid: GridDto, cellWidth: number, cellHeight: number): Array<FlexyGridEntry<GridCellDto>> {
    let result = [];
    grid.cells.forEach(cell => {
      let left = cell.column * cellWidth;
      let top = cell.row * cellHeight;
      let entry = new FlexyGridEntry(cell, left, top);

      result.push(entry);
    });

    return result;
  }

  addEvent(entry: FlexyGridEntry<GridCellDto>, cellWidth: number, cellHeight: number, project: ProjectDto): void {
    let pattern = new Pattern();
    pattern.id = this.projectsService.guid();
    project.patterns.forEach(p => p.isBeingEdited = false);
    project.patterns.push(pattern);
    let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellDto(null, row, column, pattern.id);
    project.grid.cells.push(entry.data);
  }

  removeEvent(entry: FlexyGridEntry<GridCellDto>,project:ProjectDto): void {
  /*  let index = project.patterns.findIndex(p=>p.id===entry.data.patternId);
    project.patterns.splice(index,1);
    grid.cells.indexOf(
    entry.data = null;*/
  }


}
