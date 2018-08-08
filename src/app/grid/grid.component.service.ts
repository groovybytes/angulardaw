import {Inject, Injectable} from "@angular/core";
import {Project} from "../model/daw/Project";
import {System} from "../system/System";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {TrackDto} from "../shared/api/TrackDto";
import {PluginsService} from "../shared/services/plugins.service";
import {PatternsService} from "../shared/services/patterns.service";
import {GridDto} from "../shared/api/GridDto";

@Injectable()
export class GridComponentService {

  constructor(
    private pluginsService:PluginsService,
    private patternService: PatternsService,
    @Inject("TracksApi") private tracks: ApiEndpoint<TrackDto>,
    @Inject("GridApi") private grid: ApiEndpoint<GridDto>,
    private system: System) {


  }

  /*onCellClicked(project:Project,cell: PatternCell,emitter): void{
   /!* if (!cell.pattern) this.patternService.create(project)
      .then(pattern => {
        cell.pattern = pattern;
        emitter.emit(cell.pattern);

      })
      .catch(error => {
        this.system.error(error)
      });
    else emitter.emit(cell.pattern);*!/
  }*/
/*  selectInstrument(instr: string, column: ColumnInfo,project:Project): Promise<void> {
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


  }*/
}
