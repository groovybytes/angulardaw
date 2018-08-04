import {ProjectDto} from "../ProjectDTO";
import {TransportParams} from "../../../model/daw/TransportParams";
import {TimeSignature} from "../../../model/mip/TimeSignature";
import {Project} from "../../../model/daw/Project";

export class ProjectMapper {
  static toJSON(project: Project): ProjectDto {
    let entity={bpm:0,name:"",quantization:0,signature:"",id:0};
    entity.bpm = project.transportParams.bpm;
    entity.name = project.name;
    entity.quantization = project.transportParams.quantization;
    entity.signature = project.transportParams.signature.beatUnit+","+project.transportParams.signature.barUnit;
    entity.id=project.id;

    return entity;
  }

  static fromJSON(projectEntity: ProjectDto): Project {
    let project = new Project();
    let transportParams = project.transportParams = new TransportParams();
    transportParams.bpm = projectEntity.bpm;
    let signatureItems = projectEntity.signature.split(",");
    transportParams.signature = new TimeSignature(parseInt(signatureItems[0]),parseInt(signatureItems[1]));
    transportParams.quantization = projectEntity.quantization;
    project.name = projectEntity.name;
    project.id = projectEntity.id;
    project.tracks.length = 0;

    return project;


  }
}
