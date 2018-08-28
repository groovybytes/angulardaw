import {Observable} from "rxjs/internal/Observable";
import {TimeSignature} from "../../mip/TimeSignature";

export class MasterTransportParams{

  bpm:Observable<number>;
  signature:Observable<TimeSignature>;
}
