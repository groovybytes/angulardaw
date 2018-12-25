import {Inject, Injectable} from '@angular/core';
import {ProjectsService} from "../shared/services/projects.service";
import {ProjectsApi} from "../api/projects.api";
import {Project} from "../model/daw/Project";
import {DawInfo} from "../model/DawInfo";
import {Thread} from "../model/daw/Thread";

@Injectable({
  providedIn: 'root'
})
export class BootstrapperService {

  constructor(
    private projectsService: ProjectsService,
    @Inject("daw") private daw: DawInfo,
    private projectsApi: ProjectsApi) {
  }


  loadProject(projectId: string): Promise<Project> {

    return new Promise((resolve, reject) => {
      let newProject = JSON.parse(localStorage.getItem("new_project"));
      if (newProject) {
        localStorage.setItem("new_project", null);

        this.projectsService.createProject(projectId, newProject.name, newProject.plugins)
          .then(project => {

            let dto = this.projectsService.serializeProject(project);
            dto.id = projectId;
            dto.name = dto.id;
            this.projectsApi.create(dto)
              .then(() => {
                this.setupThreads(project);
                project.ready = true;
                this.daw.project.next(project);

                resolve(project);
              })
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
      } else {

        this.projectsApi.getById(projectId).then(result => {
          this.projectsService.deSerializeProject(result.data)
            .then(project => {
              this.setupThreads(project);
              this.daw.project.next(project);
              project.ready = true;

              resolve(project);

            })
            .catch(error => reject(error));
        })
          .catch(error => reject(error));
      }
    })

  }

  private setupThreads(project: Project): void {
    project.threads.push(new Thread("ticker","assets/js/tick_worker.js"));
  }

}
