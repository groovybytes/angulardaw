import {NgModule} from "@angular/core";
import {FilesApi} from "./files.api";
import {ProjectsApi} from "./projects.api";
import {SamplesApi} from "./samples.api";



@NgModule({
  declarations: [

  ],
  imports: [


  ],
  providers: [
    FilesApi,
    ProjectsApi,
    SamplesApi
   
  ],
  exports: []
})
export class ApiModule {
}

