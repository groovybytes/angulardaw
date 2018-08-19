import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {ProjectsPageComponent} from "./projects-page/projects-page.component";
import {TestsComponent} from "./ui/tests/tests.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectsPageComponent
  },

  {
    path: 'projects',
    component: ProjectsPageComponent
  },
  {
    path: 'main/:projectId',
    component: MainPageComponent
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
