import {Component, OnInit} from '@angular/core';
import {System} from "./system/System";
import {MessagingService} from "./system/messaging.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private system: System,
              private messaging: MessagingService) {


  }

  ngOnInit() {
    this.system.errors.subscribe(error => {
      throw error;
   /*   let msg = "";
      if (error.data) msg=JSON.stringify(error.data.stack);
      else msg=JSON.stringify(error);
      this.messaging.log(msg,Severity.ERROR);*/

    })

  }

}


