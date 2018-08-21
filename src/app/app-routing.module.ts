import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestsComponent} from "./ui/tests/tests.component";
import {ProjectsCreateComponent} from "./daw/projects-create/projects-create.component";
import {ProjectComponent} from "./daw/project/project.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectsCreateComponent
  },
  {
    path: 'main/:projectId',
    component: ProjectComponent
  },
  {
    path: 'test',
    component: TestsComponent
  }
];

@NgModule({
  providers: [

  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
