import {Component, OnInit} from '@angular/core';
import {AngularDawService} from "../services/angular-daw.service";

@Component({
  selector: 'angular-daw',
  templateUrl: './angular-daw.component.html',
  styleUrls: ['./angular-daw.component.scss']
})
export class AngularDawComponent implements OnInit {

  constructor(private dawService: AngularDawService) {

  }

  ngOnInit() {
    this.dawService.bootstrap();
  }

}
