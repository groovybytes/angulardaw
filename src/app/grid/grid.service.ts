import {Inject, Injectable} from "@angular/core";
import {PatternCell} from "./model/pattern.cell";
import {Project} from "../model/daw/Project";
import {ColumnInfo} from "./model/ColumnInfo";
import {ProjectsService} from "../shared/services/projects.service";
import {System} from "../system/System";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {TrackDto} from "../shared/api/TrackDto";
import {PluginId} from "../model/daw/plugins/PluginId";
import {PluginsService} from "../shared/services/plugins.service";

@Injectable()
export class GridService {

  constructor(
    private projectsService: ProjectsService,
    private pluginsService:PluginsService,
    @Inject("TracksApi") private tracks: ApiEndpoint<TrackDto>,
    private system: System) {


  }

  createPatternCells(project: Project, rows: number, columns: number): Array<Array<PatternCell>> {
    let model = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < columns; j++) {
        row.push(new PatternCell(j, i, null));
      }
    }

    return model;
  }

  createColumnInfos(project: Project, columns: number): Array<ColumnInfo> {
    let result = [];
    for (let i = 0; i < columns; i++) {
      let track = project.tracks.find(t => t.index === i);
      let instrument = track ? track.plugins[0] : null;
      let info = new ColumnInfo(i, track, instrument);
      result.push(info);
    }

    return result;
  }

  selectInstrument(instr: string, column: ColumnInfo,project:Project): Promise<void> {
    if (!column.track) {
      column.track = this.projectsService.addTrack(project,column.column);
    }
    return this._selectInstrument(instr,column);


  }

  private _selectInstrument(instr: string, column: ColumnInfo): Promise<void> {
   return new Promise((resolve, reject) => {
      if (instr === "") {
        if (column.instrument) column.instrument.destroy();
        this.projectsService.removePlugin(column.track,0);
        column.instrument=null;
        resolve();
      }
      else this.projectsService.addPlugin(column.track, PluginId[instr.toUpperCase()],0)
        .then(instrument => {
          column.instrument=instrument;
          resolve();
        })
        .catch(error => reject(error))
    })


  }
}
