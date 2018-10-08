import {Component, Inject, OnInit} from '@angular/core';
import {System} from "./system/System";
import {MessagingService} from "./system/messaging.service";
import {KeyboardState} from "./shared/model/KeyboardState";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private system: System,
              @Inject("KeyboardState") private keyboardState:KeyboardState,
              private messaging: MessagingService) {


  }

  ngOnInit() {

    this.keyboardState.bind("ctrl",this.keyboardState.Ctrl);
    this.system.errors.subscribe(error => {
      throw error;
      /*   let msg = "";
         if (error.data) msg=JSON.stringify(error.data.stack);
         else msg=JSON.stringify(error);
         this.messaging.log(msg,Severity.ERROR);*/

    })

  }


}


