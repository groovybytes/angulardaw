import {NgModule} from "@angular/core";
import {InMemoryApiEndpoint} from "./api/InMemoryApiEndpoint";
import {ProjectsService} from "./services/projects.service";

let projectsApi=new InMemoryApiEndpoint("__projects");
let tracksApi=new InMemoryApiEndpoint("__tracks");
let eventsApi=new InMemoryApiEndpoint("__events");

@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers: [
    ProjectsService,
    { provide: "ProjectsApi", useValue: projectsApi },
    { provide: "TracksApi", useValue: tracksApi },
    { provide: "EventsApi", useValue: eventsApi },
  ]
})
export class SharedModule {
}

