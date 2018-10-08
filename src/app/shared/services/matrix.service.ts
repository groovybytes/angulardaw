import {Inject, Injectable} from "@angular/core";
import * as _ from "lodash";
import {TracksService} from "./tracks.service";
import {Matrix} from "../model/daw/matrix/Matrix";
import {Pattern} from "../model/daw/Pattern";
import {Cell} from "../model/daw/matrix/Cell";
import {Track} from "../model/daw/Track";
import {PluginInfo} from "../model/daw/plugins/PluginInfo";
import {Project} from "../model/daw/Project";


@Injectable()
export class MatrixService {

  constructor(
    private trackService:TracksService
  ) {

  }

  getPatternForTrack(trackId: string, row: number, matrix: Matrix): Pattern {
    let cells = matrix.body[row];
    let cell = cells.find(cell => cell.trackId === trackId);

    return cell.data;

  }

  addColumn(matrix: Matrix, defaultNumberOfRows: number): number {

    let isEmptyMatrix: boolean = matrix.rowHeader.length === 0;
    let columnIndex = matrix.header.length;
    let headerCell = new Cell<Track>(-1, columnIndex);
    matrix.header.push(headerCell);

    if (isEmptyMatrix) {
      for (let i = 0; i < defaultNumberOfRows; i++) {
        let rowHeaderCell = new Cell<string>(i, -1);
        rowHeaderCell.data = this.guid();
        matrix.rowHeader.push(rowHeaderCell);
      }
      for (let i = 0; i <defaultNumberOfRows; i++) {
        let newRow=[];
        matrix.body.push(newRow);
        newRow.push(new Cell<Pattern>(i, 0));
      }


    }
    else{
      for (let i = 0; i < matrix.body.length; i++) {
        let cell = new Cell<Pattern>(i, columnIndex);
        matrix.body[i].push(cell);

      }
    }
    return columnIndex;

  }

  addRow(matrix: Matrix): number {

    let rowIndex = matrix.rowHeader.length;

    let rowHeaderCell = new Cell<string>(rowIndex, -1);
    rowHeaderCell.animation="1";
    matrix.rowHeader.push(rowHeaderCell);

    let newBodyRow = [];
    matrix.body.push(newBodyRow);

    for (let i = 0; i < matrix.header.length; i++) {
      newBodyRow.push(new Cell<Pattern>(rowIndex, i));
    }

    return rowIndex;

  }

  removeRow(matrix: Matrix,row:number): void {
    matrix.rowHeader[row].animation="2";
    setTimeout(()=>{
      matrix.rowHeader.splice(row,1);

      //rowHeaderCell.animation="1";
      matrix.body.forEach((_row,index)=>{
        if (index === row) matrix.body.splice(index,1);
      });
    },500)


  }

  addMatrixColumnWithPlugin(plugin: PluginInfo, project: Project): Promise<Track> {

    return new Promise((resolve, reject) => {
      let matrix = project.matrix;
      let newColumnIndex = this.addColumn(matrix, 4);

      this.trackService.addTrackWithPlugin(plugin,project)
        .then(track=>{
          let header = matrix.header.find(cell => cell.column === newColumnIndex);
          header.data = track;
          header.trackId = track.id;
          _.flatten(matrix.body).filter(cell => cell.column === newColumnIndex).forEach(cell => {
            cell.trackId = track.id;
          });
          resolve(track);
        })
        .catch(error=>reject(error));

    })
  }



  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
