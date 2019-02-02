import {Component, Inject, OnInit} from '@angular/core';
import {Push} from "../model/Push";
import {Subscription} from "rxjs";

@Component({
  selector: 'push-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  private subscriptions:Array<Subscription>=[];

  message:string;

  constructor(@Inject("Push") private push: Push) { }

  ngOnInit() {
    this.subscriptions.push(this.push.message.subscribe(message=>{
      this.message=message.message;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr=>subscr.unsubscribe());
  }


}
