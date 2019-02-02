import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LocalStorageArray} from "../utils/LocalStorageArray";
import {ProjectDto} from "../model/daw/dto/ProjectDto";
import {AppConfiguration} from "../app.configuration";
import {ApiResponse} from "./ApiResponse";
import {Observable} from "rxjs";

@Injectable()
export class ProjectsApi {


  private db: LocalStorageArray<ProjectDto>;

  constructor(private http: HttpClient, private configuration: AppConfiguration) {
    this.db = new LocalStorageArray<ProjectDto>("_projects");
  }

  getById(id: string): Promise<ApiResponse<ProjectDto>> {
    const options={ params: new HttpParams().set('id', id) };
    return this.http.get<ApiResponse<ProjectDto>>(this.configuration.getUrl("get"), options).toPromise();
  }

  getAll():  Promise<ApiResponse<Array<{id:string,name:string}>>> {
    return this.http.get<ApiResponse<Array<{id:string,name:string}>>>(this.configuration.getUrl("all")).toPromise();
  }

  create(project: ProjectDto): Promise<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.configuration.getUrl("save"), {
      project: project
    }).toPromise();

  }

  update(project: ProjectDto): Promise<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.configuration.getUrl("save"), {
      project: project
    }).toPromise();
  }


  /* create(email: string, password: string, password2: string): Promise<any> {
     return this.http.post(this.configuration.getUrl("users"), {
       email: email,
       password: password,
       access_token: "uDohyaWjMnpphGSlBA6qfQK0ziV5RMDP"
     }).toPromise();
   }*/

}
