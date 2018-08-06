
import {Track} from "../../model/daw/Track";
import {WstPlugin} from "../../model/daw/WstPlugin";

export class ColumnInfo{
  constructor(column: number, track: Track, instrument: WstPlugin) {
    this.column = column;
    this.track = track;
    this.instrument = instrument;
  }

  column:number;
  track:Track;
  instrument:WstPlugin;

}
