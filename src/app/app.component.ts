import {Component, OnInit} from '@angular/core';
import {WorkstationService} from "./shared/services/workstation.service";
import {Transport} from "./model/daw/Transport";
import {System} from "./system/System";
import {MessagingService} from "./system/messaging.service";
import {Severity} from "./system/Severity";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  workstation: WorkstationService;
  transport: Transport;

  constructor(private system: System,
              private messaging: MessagingService,
              workstation: WorkstationService) {
    this.workstation = workstation;
    this.transport = new Transport(() => workstation.audioContext.currentTime);

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


