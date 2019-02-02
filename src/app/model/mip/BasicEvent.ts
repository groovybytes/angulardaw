import {Lang} from "../utils/Lang";

export class BasicEvent {

  id: string;


  constructor() {

    this.id = Lang.guid();
  }

}
