import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Track} from "../../model/daw/Track";
import {Project} from "../../model/daw/Project";


@Component({
  selector: 'plugin-panel',
  templateUrl: './plugin-panel.component.html',
  styleUrls: ['./plugin-panel.component.scss']
})
export class PluginPanelComponent implements OnInit {

  @Input() project:Project;
  @Input() track:Track;



  constructor() { }

  ngOnInit() {
  }





}
