import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {AppConfiguration} from "../../app.configuration";
import {AuthService} from "../services/auth.service";
import {ProjectEntity} from "../../../../../audiotools-server/src/projects/project.entity";


@Injectable()
export class ProjectsApi {
  constructor(private http: HttpClient,
              private auth: AuthService,
              private config: AppConfiguration) {

  }

  saveProject(project: ProjectEntity): Observable<ProjectEntity> {
    return this.http.post<ProjectEntity>(this.config.getUrl("projects"), project)
  }

  getProject(id: string): Observable<ProjectEntity> {
    return this.http.get<ProjectEntity>(this.config.getUrl("projects/" + id));
  }

  getAllProjects(): Observable<Array<ProjectEntity>> {
    const _headers = new HttpHeaders();
    const headers = _headers.append('token', this.auth.getUserId());
    return this.http.get<Array<ProjectEntity>>(this.config.getUrl("projects"), {headers: headers});

  }


}
