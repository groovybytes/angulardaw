import {Dynamics} from "../utils/Dynamics";
import {NoteInfo} from "../utils/NoteInfo";

export interface Playable{
   play(when:number, duration:number, notes: Array<NoteInfo>, dynamics:Dynamics):void;

}
