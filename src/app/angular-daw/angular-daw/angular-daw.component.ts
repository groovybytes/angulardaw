import {Component, Input, OnInit} from '@angular/core';
import {Workstation} from "../model/daw/Workstation";

@Component({
  selector: 'angular-daw',
  templateUrl: './angular-daw.component.html',
  styleUrls: ['./angular-daw.component.scss']
})
export class AngularDawComponent implements OnInit {

  @Input() workstation:Workstation;

  constructor() {

  }

  ngOnInit() {

  }

}
