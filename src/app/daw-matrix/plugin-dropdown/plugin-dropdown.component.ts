import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PluginInfo} from "../../shared/model/daw/plugins/PluginInfo";


@Component({
  selector: 'plugin-dropdown',
  templateUrl: './plugin-dropdown.component.html',
  styleUrls: ['./plugin-dropdown.component.scss']
})
export class PluginDropdownComponent implements OnInit {

  @Input() plugins:Array<PluginInfo>;
  @Output() pluginSelected:EventEmitter<PluginInfo>=new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
