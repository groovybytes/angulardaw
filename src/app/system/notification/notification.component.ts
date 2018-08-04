import { Component, OnInit } from '@angular/core';
import {System} from "../System";
import {SystemNotification} from "../SystemNotification";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private system:System) { }

  ngOnInit() {
    this.system.notifications.subscribe((msg:SystemNotification)=>{

    })
  }

}
