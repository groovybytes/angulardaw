import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ProjectsCreateComponent} from "./projects-create/projects-create.component";
import {ProjectComponent} from "./project/project.component";
import {DawmatrixModule} from "./daw-matrix/dawmatrix.module";
import {DawControlComponent} from "./daw-control/daw-control.component";
import {ConsoleComponent} from "./console/console.component";
import {SharedModule} from "./shared/shared.module";
import {UiModule} from "../ui/ui.module";


let audioContext = new AudioContext();

@NgModule({
  declarations: [
    ProjectsCreateComponent,
    ProjectComponent,
    DawControlComponent,
    ConsoleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DawmatrixModule,
    SharedModule,
    UiModule
  ],
  providers: [
    {provide: "lodash", useValue: window["_"]},
    {provide: "AudioContext", useValue: audioContext}

  ],
  exports: []
})
export class DawModule {
}

