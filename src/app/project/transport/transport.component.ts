import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../model/daw/Project";



@Component({
  selector: 'transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  @Input() project:Project;
  constructor() {

  }

  ngOnInit() {

  }

  toggleRecord():void{

  }
}
