import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../../../app.configuration";
import {LocalStorageArray} from "../../../utils/LocalStorageArray";
import {ProjectDto} from "../../model/daw/dto/ProjectDto";

@Injectable()
export class ProjectsApi {


  private db: LocalStorageArray<ProjectDto>;

  constructor(private http: HttpClient, private configuration: AppConfiguration) {
    this.db = new LocalStorageArray<ProjectDto>("_projects");
  }

  getById(id: string): Promise<ProjectDto> {
    return new Promise((resolve, reject) => {
      resolve(this.db.find(o => o["id"] === id)[0]);
    })
  }

  getAll(): Promise<Array<ProjectDto>> {
    return new Promise((resolve, reject) => {
      let all = this.db.all();
      resolve(this.db.all());
    })
  }

  create(project: ProjectDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.add(project);
      resolve();
    })
  }

  update(project: ProjectDto): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.update(project, p => p.id === project.id);
      resolve();
    })
  }


 /* create(email: string, password: string, password2: string): Promise<any> {
    return this.http.post(this.configuration.getUrl("users"), {
      email: email,
      password: password,
      access_token: "uDohyaWjMnpphGSlBA6qfQK0ziV5RMDP"
    }).toPromise();
  }*/

}
