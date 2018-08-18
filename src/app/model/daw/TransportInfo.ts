import {TransportPosition} from "./TransportPosition";

export interface TransportInfo {
  isRunning():boolean;
 /* getPositionInfo(): TransportPosition;*/
  getStartTime():number;
  getEndTime():number;
}
