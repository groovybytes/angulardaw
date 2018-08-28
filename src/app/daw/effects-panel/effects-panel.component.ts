import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../model/daw/Track";

@Component({
  selector: 'effects-panel',
  templateUrl: './effects-panel.component.html',
  styleUrls: ['./effects-panel.component.scss']
})
export class EffectsPanelComponent implements OnInit {

  @Input() track:Track;

  constructor() { }

  ngOnInit() {
  }

}
