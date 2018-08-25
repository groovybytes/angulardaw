/*
import {Injectable} from "@angular/core";
import {Scene} from "../../model/daw/Scene";
import {Project} from "../../model/daw/Project";
import {MatrixService} from "./matrix.service";
import {Matrix} from "../../model/daw/matrix/Matrix";
import {Track} from "../../model/daw/Track";
import {Pattern} from "../../model/daw/Pattern";


@Injectable()
export class ScenesService {

  constructor(private matrixService:MatrixService) {

  }

  createScene(index:number,project:Project,matrix:Matrix):Scene{
    let patterns:Array<{track:Track,pattern:Pattern}>=[];
    project.tracks.forEach(track=>{
      let pattern = this.matrixService.getPatternForTrack(track.id,index,matrix);
      patterns.push({track:track,pattern:pattern});
    });

    return new Scene(project.transport,patterns);
  }
}
*/
