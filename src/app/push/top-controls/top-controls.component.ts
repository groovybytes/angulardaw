import {Component, Inject, OnInit} from '@angular/core';
import {Push} from "../model/Push";
import {PushMode} from "../model/PushMode";

@Component({
  selector: 'push-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss']
})
export class TopControlsComponent implements OnInit {

  constructor(@Inject("Push") private push: Push) { }

  ngOnInit() {
  }

  learnKeyClick():void{
    if (this.push.mode===PushMode.DEFAULT) this.push.mode=PushMode.LEARN_KEY;
    else this.push.mode=PushMode.DEFAULT;
  }

}
