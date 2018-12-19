import {Scale} from "./Scale";
import {ScaleId} from "./ScaleId";


export class Scales {
  static initialize() {

    Scales[ScaleId.CHROMATIC]=new Scale(ScaleId.CHROMATIC, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "chromatic");
    Scales[ScaleId.IONIAN]=new Scale(ScaleId.IONIAN, [1, 3, 5, 6, 8, 10, 12], "ionian");
    Scales[ScaleId.NATURAL_MINOR]=new Scale(ScaleId.NATURAL_MINOR, [1, 3, 4, 6, 8, 10, 12], "natural minor");

  }

  static get(id:ScaleId):Scale{
    return Scales[id];
  }
}

