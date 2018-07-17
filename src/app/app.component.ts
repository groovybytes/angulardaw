import {
  Component, Inject,
  OnInit
} from '@angular/core';
import {Workstation} from "./angular-daw/model/daw/Workstation";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  workstation: Workstation;

  constructor(@Inject("AudioContext") private audioContext: AudioContext) {

  }

  ngOnInit() {
    this.workstation = new Workstation(this.audioContext);
    this.workstation.createProject();


  }


}


