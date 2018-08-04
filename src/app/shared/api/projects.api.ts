/*
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {AppConfiguration} from "../../app.configuration";
import {AuthService} from "../services/auth.service";
import {ProjectDto} from "./ProjectDto";
import {LocalStorageArray} from "../../utils/LocalStorageArray";
import {IProjectsApi} from "./IProjectsApi";

declare var _;

@Injectable()
export class ProjectsApi implements IProjectsApi {

  private localStorage: LocalStorageArray<ProjectDto>;

  constructor(private http: HttpClient,
              private auth: AuthService,
              private config: AppConfiguration) {
    this.localStorage = new LocalStorageArray<ProjectDto>("projects");

  }

  post(project: ProjectDto): Promise<ProjectDto> {

    const _headers = new HttpHeaders();
    const headers = _headers.set("x-auth-token", this.auth.getUserId());
    return this.http.post<ProjectDto>(this.config.getUrl("projects"), project, {headers: headers})


  }

  put(project: ProjectDto): Promise<ProjectDto> {

    const _headers = new HttpHeaders();
    const headers = _headers.set("x-auth-token", this.auth.getUserId());
    return this.http.put<ProjectDto>(this.config.getUrl("projects/"+project.id), project, {headers: headers}).


  }

  get(id: string): Promise<ProjectDto> {
    const _headers = new HttpHeaders();
    const headers = _headers.set("x-auth-token", this.auth.getUserId());
    return this.http.get<ProjectDto>(this.config.getUrl("projects/" + id));
  }

  getAll(): Promise<Array<ProjectDto>> {
    const _headers = new HttpHeaders();
    const headers = _headers.set("x-auth-token", this.auth.getUserId());
    return this.http.get<Array<ProjectDto>>(this.config.getUrl("projects"), {headers: headers});

  }


}
*/
