import {GridDto} from "../../shared/api/GridDto";

export class Grid {
  constructor(model: GridDto) {
    this.model = model;
  }

  model: GridDto;
}
