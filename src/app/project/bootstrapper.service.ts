import {Inject, Injectable} from '@angular/core';
import {ProjectsService} from "../shared/services/projects.service";
import {ProjectsApi} from "../api/projects.api";
import {Project} from "../model/daw/Project";
import {DawInfo} from "../model/DawInfo";
import {TransportSession} from "../model/daw/session/TransportSession";
import {Notes} from "../model/mip/Notes";
import {AudioContextService} from "../shared/services/audiocontext.service";
import {Metronome} from "../model/daw/Metronome";
import {filter} from "rxjs/operators";
import {DawEventCategory} from "../model/daw/DawEventCategory";
import {SamplesApi} from "../api/samples.api";

@Injectable({
  providedIn: 'root'
})
export class BootstrapperService {

  constructor(
    private projectsService: ProjectsService,
    private audioContext: AudioContextService,
    private samplesV2Service: SamplesApi,
    @Inject("daw") private daw: DawInfo,
    @Inject("Notes") private notes: Notes,
    private projectsApi: ProjectsApi) {
  }


  loadProject(projectId: string): Promise<Project> {

    return new Promise((resolve, reject) => {
      let newProject = JSON.parse(localStorage.getItem("new_project"));
      if (newProject) {
        localStorage.setItem("new_project", null);

        this.projectsService.initializeNewProject(projectId, newProject.name, newProject.plugins)
          .then(project => {
            let dto = this.projectsService.serializeProject(project);
            dto.id = projectId;
            dto.name = dto.id;
            this.projectsApi.create(dto)
              .then(() => {

                this.initializeProject(project)
                  .then(() => {
                    this.daw.project.next(project);
                    project.ready = true;
                    resolve(project);
                  })
              })
              .catch(error => reject(error));
          })
          .catch(error => reject(error));
      } else {

        this.projectsApi.getById(projectId).then(result => {
          this.projectsService.deSerializeProject(result.data)
            .then(project => {
              this.initializeProject(project)
                .then(() => {
                  this.daw.project.next(project);
                  project.ready = true;
                  resolve(project);
                })
                .catch(error => reject(error));


            })
            .catch(error => reject(error));
        })
          .catch(error => reject(error));
      }
    })

  }

  initializeProject(project: Project): Promise<void> {
    return new Promise<void>(((resolve, reject) => {

      project.session = new TransportSession(
        project.events,
        project.recordSession,
        project.threads.find(t => t.id === "ticker"),
        (note1, note2) => this.notes.getInterval(this.notes.getNote(note1), this.notes.getNote(note2)) * 100,
        (targetId, note) => project.plugins.find(plugin => plugin.getInstanceId() === targetId).getSample(note),
        this.audioContext.getAudioContext(),
        project.bpm);


      this.samplesV2Service.getClickSamples().then(result => {
        project.metronome = new Metronome(
          this.audioContext.getAudioContext(),
          project.events,
          this.daw.destroy,
          project.settings.metronomeSettings.enabled,
          result.accentSample.buffer,
          result.defaultSample.buffer);

        resolve();
      })


    }));

  }


}
