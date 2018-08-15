import {NgModule} from "@angular/core";
import {PatternObserverComponent} from "./patterns/patternobserver.component";

@NgModule({
  declarations: [
    PatternObserverComponent
  ],
  exports:[
    PatternObserverComponent
  ],
  imports: [],
  providers: []
})
export class ObserversModule {
}

