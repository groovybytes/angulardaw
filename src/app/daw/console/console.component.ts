import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";

@Component({
  selector: 'console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  @Input() project:Project;
  @Input() controlWidth:number=100;
  @Input() controlHeight:number=200;


  constructor() { }

  ngOnInit() {
  }

}
