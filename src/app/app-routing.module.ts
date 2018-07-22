import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StepsequencerComponent} from "./stepsequencer/stepsequencer.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {
    path: '',
    component: AppComponent
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
