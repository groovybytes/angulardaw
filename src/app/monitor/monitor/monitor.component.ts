import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DawInfo} from "../../model/DawInfo";
import {Project} from "../../model/daw/Project";
import {Subscription} from "rxjs";
import {DawEvent} from "../../model/daw/DawEvent";
import {DawEventCategory} from "../../model/daw/DawEventCategory";
import {AudioContextService} from "../../shared/services/audiocontext.service";
import {MessagingService} from "../../system/messaging.service";
import {Severity} from "../../system/Severity";

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnDestroy {


  msgs: Array<string> = [];
  project: Project;

  private eventSubscription:Subscription;
  private projectSubscription:Subscription;

  constructor(
    private logger:MessagingService,
    @Inject("daw") private daw: DawInfo,
    private audioContext:AudioContextService) {
  }

  ngOnInit() {

    this.projectSubscription=this.daw.project.subscribe(project => {
      if (project){
        if (this.eventSubscription && !this.eventSubscription.closed) this.eventSubscription.unsubscribe();
        this.project = project;
        this.eventSubscription=project.events.subscribe((event:DawEvent<any>)=>{
          let msg=this.audioContext.getTime().toFixed(2) +":"+DawEventCategory[event.category]+": "+JSON.stringify(event.data);
          this.msgs.push(msg);
          this.logger.log(msg,Severity.DEBUG);
        });
      }

    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
  }
}
