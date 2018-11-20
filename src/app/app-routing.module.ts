import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestsComponent} from "./ui/tests/tests.component";
import {LandingPageComponent} from "./landing-page.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {LoginComponent} from "./authentication/login/login.component";
import {ProjectsCreateComponent} from "./project/projects-create/projects-create.component";
import {ProjectComponent} from "./project/project.component";

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
    path: 'test',
    component: TestsComponent
  }
];

@NgModule({
  providers: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
