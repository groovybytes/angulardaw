import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PluginId} from "../model/daw/plugins/PluginId";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {DawGridService} from "./daw-grid.service";
import {GridCellViewModel} from "../model/viewmodel/GridCellViewModel";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";

@Component({
  selector: 'daw-grid',
  templateUrl: './daw-grid.component.html',
  styleUrls: ['./daw-grid.component.scss']
})
export class DawGridComponent implements OnInit, OnChanges {

  @Input() project: ProjectViewModel;
  plugins: Array<string> = Object.keys(PluginId);


  @Input() cellWidth: number;
  @Input() cellHeight: number;
  @Output() focusedPatternChanged: EventEmitter<{pattern:PatternViewModel,trackId:string}> = new EventEmitter();
  @Output() pluginChanged: EventEmitter<TrackViewModel> = new EventEmitter<TrackViewModel>();
  @Output() trackAdded: EventEmitter<TrackViewModel> = new EventEmitter<TrackViewModel>();
  @Output() trackRemoved: EventEmitter<TrackViewModel> = new EventEmitter<TrackViewModel>();

  constructor(private gridService: DawGridService) {
  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project && changes.project.currentValue) {
      if (this.project.grid.headerCells.length === 0) this.project.grid.headerCells = this.gridService.createHeaderCells(this.project.grid.nColumns);
      if (this.project.grid.contentCells.length === 0) this.project.grid.contentCells = this.gridService.createContentCells(this.project.grid.nRows, this.project.grid.nColumns);
      this.gridService.updateEntryPositions(this.project.grid, this.cellWidth, this.cellHeight);
      if (this.project.focusedPattern) {
        let entry = this.project.grid.entries.find(entry=>entry.data&&entry.data.patternId===this.project.focusedPattern);
        this.gridService.changePattern(this.project,entry,this.focusedPatternChanged);
      }
    }
  }

  onGridEntryAdded(entry: FlexyGridEntry<GridCellViewModel>): void {
    let newPattern = this.gridService.addEvent(entry, this.cellWidth, this.cellHeight, this.project.patterns);
    this.gridService.changePattern(this.project,entry,this.focusedPatternChanged);

  }

  onGridEntryRemoved(entry: FlexyGridEntry<GridCellViewModel>): void {
    this.gridService.removeEvent(entry, this.project.patterns);
    this.focusedPatternChanged.emit(null);
  }

  onGridEntryUpdated(entry: FlexyGridEntry<GridCellViewModel>): void {
    this.gridService.updateEvent(entry, this.cellWidth, this.cellHeight);
  }

  onEntryClicked(entry: FlexyGridEntry<GridCellViewModel>): void {
    this.gridService.changePattern(this.project,entry,this.focusedPatternChanged);
  }

  onCellClicked(cell: ContentCell): void {
    this.gridService.changePattern(this.project,null,this.focusedPatternChanged);

  }

  setPlugin(pluginId: PluginId, cell: HeaderCell<TrackViewModel>): void {
    let trackAdded = this.gridService.setPlugin(pluginId, cell, this.project);
    if (trackAdded) this.trackAdded.emit(cell.data);
    this.pluginChanged.emit(cell.data);
  }


}
