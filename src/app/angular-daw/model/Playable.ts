import {Dynamics} from "./theory/Dynamics";
import {Note} from "./theory/Note";

export interface Playable{
   play(when:number,duration:number,notes: Array<Note>,dynamics:Dynamics):void;

}
