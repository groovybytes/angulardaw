import {Inject, Injectable} from '@angular/core';
import {Pad} from "./model/Pad";
import {Push} from "./model/Push";
import {Notes} from "../model/mip/Notes";
import {PadInfo} from "./model/PadInfo";
import {KeyBindings} from "./model/KeyBindings";
import {PushSettings} from "./model/PushSettings";
import {ScaleId} from "../model/mip/scales/ScaleId";
import {EventCategory} from "../model/daw/devices/EventCategory";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(@Inject("Push") private push: Push,
              @Inject("Notes") private noteInfo: Notes) {
  }

  setup() {

    if (!this.push.keyBindings || this.push.keyBindings.length === 0) {
      this.push.keyBindings = [];
      this.push.keyBindings.push(KeyBindings.default);

    }
    this.setPadCollection(this.push.settings);


  }

  setPadCollection(settings: PushSettings): void {
    this.push.pads.length = 0;

    let notes = this.noteInfo;
    if (settings.scale !== ScaleId.CHROMATIC) {
      notes = new Notes(settings.scale);
    }
    let rows = this.push.settings.rows;
    let columns = this.push.settings.columns;
    let startIndex = notes.getNote(settings.baseNote).index;

    let currentIndex = startIndex;
    for (let i = 0; i < rows; i++) {
      if (i > 0) currentIndex = startIndex + 3 * i;

      for (let j = 0; j < columns; j++) {
        let note = notes.getNoteByIndex(currentIndex);
        let noteMapping = settings.noteMappings.find(mapping => mapping.note === note.id);
        let pad = new Pad(new PadInfo(note.id, rows - (i + 1) + 1, noteMapping ? noteMapping.label : note.id, j + 1));
        this.push.pads.push(pad);

        currentIndex++;
      }
    }
  }


  changeSize(columns: number, rows: number): void {
    this.push.settings.rows = rows;
    this.push.settings.columns = columns;
    this.setPadCollection(this.push.settings);
  }

  moveMatrix(semitones: number): void {

    let baseNote = this.noteInfo.getNote(this.push.settings.baseNote);
    let newBase = this.noteInfo.move(baseNote, semitones);
    this.push.settings.baseNote = newBase.id;
    this.setPadCollection(this.push.settings);
  }

  nextPlugin(deltaIndex: number): void {
    let nextIndex = 0;
    let plugins = this.push.availablePlugins.filter(plugin=>plugin.getInfo().category!=="system");
    if (plugins.length > 0) {
      let currentPlugin = this.push.plugin.getValue();
      if (currentPlugin) {
        let index = plugins.findIndex(plugin => plugin.getInstanceId() === currentPlugin.getInstanceId());
        nextIndex = (index + deltaIndex) % plugins.length;
      }

      this.push.plugin.next(plugins[nextIndex]);

      this.push.publish(EventCategory.SET_PLUGIN, this.push.plugin.getValue().getInstanceId());
    }


  }

}
