import {Inject, Injectable} from "@angular/core";
import {Matrix} from "../../model/daw/matrix/Matrix";
import {Pattern} from "../../model/daw/Pattern";


@Injectable()
export class MatrixService {

  constructor() {

  }

  getPatternForTrack(trackId: string, row: number, matrix: Matrix): Pattern {
    let cells = matrix.body[row];
    let cell = cells.find(cell => cell.trackId === trackId);

    return cell.data;

  }
}
