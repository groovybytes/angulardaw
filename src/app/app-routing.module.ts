import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {DevelopmentComponent} from "./development/development.component";
import {ProjectsPageComponent} from "./projects-page/projects-page.component";

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
    path: 'development/:projectId',
    component: DevelopmentComponent
  },
  {
    path: 'main/:projectId',
    component: MainPageComponent
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
