import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from "./authentication/register/register.component";
import {LoginComponent} from "./authentication/login/login.component";
import {ProjectsCreateComponent} from "./project/projects-create/projects-create.component";
import {ProjectComponent} from "./project/project.component";
import {MidiparserComponent} from "./prototyping/midiparser/midiparser.component";
import {TransporttestComponent} from "./prototyping/transporttest/transporttest.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectsCreateComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
  , {
    path: 'welcome',
    component: ProjectsCreateComponent
  },
  {
    path: 'project/:projectId',
    component: ProjectComponent
  },
  {
    path: 'prototyping/midiparser',
    component: MidiparserComponent
  },
  {
    path: 'prototyping/transport',
    component: TransporttestComponent
  }
];

@NgModule({
  providers: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
