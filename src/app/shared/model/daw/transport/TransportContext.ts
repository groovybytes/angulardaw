import {NoteLength} from "../../mip/NoteLength";
import {Observable} from "rxjs/index";
import {TransportSettings} from "./TransportSettings";
import {GlobalTransportSettings} from "./GlobalTransportSettings";
import {TransportEvent} from "./TransportEvent";

export class TransportContext {

  settings: TransportSettings;
  time: Observable<TransportEvent<number>>;
  transportEnd: Observable<TransportEvent<void>>;
  transportStart: Observable<TransportEvent<void>>;
  beforeStart: Observable<TransportEvent<void>>;
}
