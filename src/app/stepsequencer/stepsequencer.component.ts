import {Component, ElementRef, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {StepSequencerService} from "./stepsequencer.service";
import {SequencerBodyD3} from "./sequencer-body.d3";
import {SequencerRowBarD3} from "./sequencer.row-bar.d3";
import {CellEvents} from "./model/CellEvents";
import {MusicMath} from "../model/utils/MusicMath";
import {Clicker} from "../model/daw/Clicker";
import {SamplesApi} from "../api/samples.api";
import {Project} from "../model/daw/Project";
import {NoteLength} from "../model/mip/NoteLength";
import {SequencerTopBarD3} from "./sequencer.top-bar.d3";
import {Lang} from "../model/utils/Lang";
import {SequencerD3} from "./sequencer.d3";
import {System} from "../system/System";
import {SequencerEvent} from "./model/SequencerEvent";
import {SESSION_STORAGE, StorageService} from "angular-webstorage-service";
import {Drums} from "../model/daw/instruments/Drums";
import {MidiTrack} from "../model/daw/MidiTrack";
import {TransportService} from "../shared/services/transport.service";

@Component({
  selector: 'stepsequencer',
  templateUrl: './stepsequencer.component.html',
  providers: [StepSequencerService],
  styleUrls: ['./stepsequencer.component.scss']
})
export class StepsequencerComponent implements OnInit, OnDestroy {
  private drumKit: Drums;

  @Input() loopBarStart: number = 0;
  @Input() loobBarEnd: number = 1;
  @Input() bars: number = 20; // the length of the grid in bars
  track: MidiTrack;
  events: Array<SequencerEvent> = [];
  private renderer: SequencerD3;
  private clicker: Clicker;
  @Input() project: Project;
  LenghType = NoteLength;
  quantizationOptions = [];

  constructor(private container: ElementRef,
              private transport:TransportService,
              @Inject(SESSION_STORAGE) private storage: StorageService,
              @Inject("lodash") private _,
              private system: System,
              private samplesApi: SamplesApi,
              private sequencerService: StepSequencerService) {


  }


  ngOnInit(): void {
    this.events = [];//this.storage.get("stepsequencer.events")?this.storage.get("stepsequencer.events"):[];
    this.project.transportParams.loop = true;
    this.project.transportParams.quantization = NoteLength.Quarter;
    this.quantizationOptions = Lang.getEnumKeys(NoteLength);
    this.samplesApi.getClickSamples().then(result => {
      this.clicker = new Clicker(result.accentSample, result.defaultSample);
    });

    this.sequencerService.loadInstrument().then((drumkit) => {
      this.track = this.project.tracks[0] as MidiTrack;

      this.drumKit = drumkit;
      this.track.instrument = this.drumKit;
      let viewModel = this.sequencerService.createModel(this.bars, this.project.transportParams.quantization,
        this.project.transportParams.bpm, this.project.transportParams.signature, this.track.queue, this.drumKit.getNotes());
      this.project.transportParams.tickStart = this.loopBarStart * MusicMath.getBarTicks(this.project.transportParams.quantization,
        this.project.transportParams.signature);
      this.project.transportParams.tickEnd = this.loobBarEnd * MusicMath.getBarTicks(this.project.transportParams.quantization, this.project.transportParams.signature) - 1;
      this.transport.beat.subscribe((tick) => this.onBeat(tick));
      this.transport.time.subscribe((time) => this.onTime(time));

      let sequencerEvents = new CellEvents<CellInfo>();
      let barEvents = new CellEvents<CellInfo>();
      let svgElement = d3.select(this.container.nativeElement.querySelector("svg"));
      this.renderer = new SequencerD3(
        this.project,
        svgElement,
        drumkit,
        sequencerEvents,
        barEvents,
        new SequencerBodyD3(svgElement),
        new SequencerRowBarD3(svgElement),
        new SequencerTopBarD3(svgElement),
        this.events
      );

      this.renderer.newNote.subscribe((newNoteEvent: { note: string, time: number, row: number }) => {
        this.sequencerService.onNoteEventTriggered(this.track, newNoteEvent, this.drumKit, this.events, true);
        this.storage.set("stepsequencer.events", this.events);
        this.renderer.render(viewModel);
      });

      this.renderer.eventClicked.subscribe((event: SequencerEvent) => {
        this.sequencerService.onEventClicked(event, this.events, this.track);
        this.storage.set("stepsequencer.events", this.events);
        this.renderer.render(viewModel);
      });

      this.renderer.render(viewModel);

    }).catch(error => this.system.httpError(error));
  }


  onBeat(beat: number): void {

  }

  onTime(time: number): void {
    this.renderer.updatePosition(this.transport.getPositionInfo());
  }

  startTransport(): void {
    if (this.transport.isRunning()) this.transport.stop();
    else this.transport.start();
  }

  quantize(length: NoteLength) {
    this.transport.stop();
    this.project.transportParams.quantization = length;
    let viewModel = this.sequencerService.createModel(this.bars, this.project.transportParams.quantization,
      this.project.transportParams.bpm, this.project.transportParams.signature, this.track.queue, this.drumKit.getNotes());
    this.renderer.render(viewModel);

  }

  ngOnDestroy(): void {
  }

}
