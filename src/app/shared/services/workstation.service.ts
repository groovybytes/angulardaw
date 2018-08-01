import {Project} from "../../model/daw/Project";
import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";
import {ProjectEntity} from "../../../../../audiotools-server/src/projects/project.entity";
import {AuthService} from "./auth.service";

@Injectable()
export class WorkstationService {
  readonly audioContext: AudioContext;

  constructor(@Inject("AudioContext") audioContext: AudioContext) {

    this.audioContext = audioContext;

  }


}
