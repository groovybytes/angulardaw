/*
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {AppConfiguration} from "../../app.configuration";
import {AuthService} from "../services/auth.service";
import {ProjectDto} from "./ProjectDto";
import {LocalStorageArray} from "../../utils/LocalStorageArray";
import {TrackDto} from "./TrackDto";
import {ITracksApi} from "./ITracksApi";

declare var _;

@Injectable()
export class TracksApi implements ITracksApi {

  private localStorage: LocalStorageArray<ProjectDto>;

  constructor(private http: HttpClient,
              private auth: AuthService,
              private config: AppConfiguration) {
    this.localStorage = new LocalStorageArray<ProjectDto>("projects");

  }

  create(projectId:any,track:TrackDto  ): Observable<TrackDto> {

    const _headers = new HttpHeaders();
    const headers = _headers.set("x-auth-token", this.auth.getUserId());
    return this.http.post<TrackDto>(this.config.getUrl("tracks/"+projectId), track, {headers: headers})


  }

  update(track:TrackDto ): Observable<void> {
    return this.http.put<void>(this.config.getUrl("tracks/"+track.id), track);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(this.config.getUrl("tracks/"+id));
  }

  getAll(projectId:any): Observable<Array<TrackDto>> {
    return this.http.get<Array<TrackDto>>(this.config.getUrl("tracks/"+projectId));

  }
}
*/
