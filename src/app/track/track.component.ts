import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";
import {System} from "../system/System";
import {SamplesApi} from "../api/samples.api";

@Component({
  selector: 'daw-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {

  @Input() project:Project;
  @Input() track:Track;
  @Input() loopBarStart: number = 0;
  @Input() loobBarEnd: number = 1;
  @Input() bars: number = 20; // the length of the grid in bars
  quantizationOptions = [];

  constructor(private container: ElementRef,
              private system: System,
              private samplesApi: SamplesApi) {


  }

  ngOnInit(): void {
  }


  /*ngOnInit(): void {
    this.project.transportParams.loop = true;
    this.project.transportParams.quantization = NoteLength.Quarter;
    this.quantizationOptions = Lang.getEnumKeys(NoteLength);

    this.sequencerService.loadInstrument().then((drumkit) => {

      this.track.instrument = this.drumKit;
      let viewModel = this.sequencerService.createPatternCells(this.bars, this.project.transportParams.quantization,
        this.project.transportParams.bpm, this.project.transportParams.signature, this.track.queue, this.drumKit.getNotes());
      this.project.transportParams.tickStart = this.loopBarStart * MusicMath.getBarTicks(this.project.transportParams.quantization,
        this.project.transportParams.signature);
      this.project.transportParams.tickEnd = this.loobBarEnd * MusicMath.getBarTicks(this.project.transportParams.quantization, this.project.transportParams.signature) - 1;
      this.project.transport.beat.subscribe((tick) => this.onBeat(tick));
      this.project.transport.time.subscribe((time) => this.onTime(time));

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
    this.renderer.updatePosition(this.project.transport.getPositionInfo());
  }

  startTransport(): void {
    if (this.project.transport.isRunning()) this.project.transport.stop();
    else this.project.transport.start();
  }

  quantize(length: NoteLength) {
    this.project.transport.stop();
    this.project.transportParams.quantization = length;
    let viewModel = this.sequencerService.createPatternCells(this.bars, this.project.transportParams.quantization,
      this.project.transportParams.bpm, this.project.transportParams.signature, this.track.queue, this.drumKit.getNotes());
    this.renderer.render(viewModel);

  }

  ngOnDestroy(): void {
  }*/

}
