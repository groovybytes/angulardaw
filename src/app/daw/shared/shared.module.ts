import {NgModule} from "@angular/core";
import {InMemoryApiEndpoint} from "./api/InMemoryApiEndpoint";
import {PluginsService} from "./services/plugins.service";
import {ProjectsService} from "./services/projects.service";
import {SamplesApi} from "./api/samples.api";
import {FilesApi} from "./api/files.api";
import {TheoryService} from "./services/theory.service";
import {TracksService} from "./services/tracks.service";
import {TransportService} from "./services/transport.service";
let projectsApi=new InMemoryApiEndpoint("__projects");
let tracksApi=new InMemoryApiEndpoint("__tracks");
let eventsApi=new InMemoryApiEndpoint("__events");
let gridApi=new InMemoryApiEndpoint("__grid");
let patternApi=new InMemoryApiEndpoint("__patterns");

@NgModule({
  declarations: [

  ],
  imports: [

  ],
  providers: [
    PluginsService,
    ProjectsService,
    SamplesApi,
    FilesApi,
    TheoryService,
    TracksService,
    TransportService,
    { provide: "ProjectsApi", useValue: projectsApi },
    { provide: "TracksApi", useValue: tracksApi },
    { provide: "EventsApi", useValue: eventsApi },
    { provide: "GridApi", useValue: gridApi },
    { provide: "PatternApi", useValue: patternApi }
  ],
  exports:[

  ]
})
export class SharedModule {
}

