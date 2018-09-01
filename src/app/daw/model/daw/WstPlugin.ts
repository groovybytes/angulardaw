import {NoteTrigger} from "./NoteTrigger";


//web studio technology plugin :)
export interface WstPlugin {
  getId(): string;
  feed(event:NoteTrigger, offset:number, destinationNode?:AudioNode): any;
  destroy():void;
  load():Promise<WstPlugin>;
  getNotes():Array<string>;
}
