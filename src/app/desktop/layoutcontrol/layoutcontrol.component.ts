import { Component, OnInit } from '@angular/core';
import {LayoutManagerService} from "../layout-manager.service";

@Component({
  selector: 'layoutcontrol',
  templateUrl: './layoutcontrol.component.html',
  styleUrls: ['./layoutcontrol.component.scss']
})
export class LayoutcontrolComponent implements OnInit {

  constructor(private layout:LayoutManagerService) { }

  ngOnInit() {
  }



}
