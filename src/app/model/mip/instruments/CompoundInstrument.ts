import {NoteDynamics} from "../NoteDynamics";
import {Instrument} from "./Instrument";


export interface CompoundInstrument extends Instrument{

  addInstrument(instrument:Instrument):void;
  getInstrument(instrument:string):Instrument;
}
