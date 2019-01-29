import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ProjectComponent} from "./project.component";
import {PluginListComponent} from "./plugin-list/plugin-list.component";
import {ProjectObserverComponent} from "./project-observer/project-observer.component";
import {ProjectsCreateComponent} from "./projects-create/projects-create.component";
import {TransportComponent} from "./transport/transport.component";
import {FormsModule} from "@angular/forms";
import {DawMatrixModule} from "../daw-matrix/daw-matrix.module";
import {SequencerModule} from "../sequencer/sequencer.module";
import {ApiModule} from "../api/api.module";
import {SharedModule} from "../shared/shared.module";
import {CoreModule} from "../core/core.module";
import {RouterModule} from "@angular/router";
import {PadsComponent} from "./pads/pads.component";
import {PadsModule} from "./pads/pads.module";
import {PushModule} from "../push/push.module";
import {PushComponent} from "../push/push/push.component";
import {DeviceService} from "./device.service";
import {SequencerComponent} from "../sequencer/sequencer.component";
import {DawMatrixComponent} from "../daw-matrix/daw-matrix.component";


@NgModule({
  declarations: [
    ProjectComponent,
    PluginListComponent,
    ProjectObserverComponent,
    ProjectsCreateComponent,
    TransportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PadsModule,
    DawMatrixModule,
    SequencerModule,
    ApiModule,
    SharedModule,
    RouterModule,
    CoreModule,
    PushModule
  ],
  providers: [
    DeviceService
  ],
  entryComponents:[PadsComponent,PushComponent,SequencerComponent,DawMatrixComponent],
  exports: []
})
export class ProjectModule {
}

