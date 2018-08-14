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
    this.projectViewModel.transportParams.loop = true;
    this.projectViewModel.transportParams.quantization = NoteLength.Quarter;
    this.quantizationOptions = Lang.getEnumKeys(NoteLength);

    this.sequencerService.loadInstrument().then((drumkit) => {

      this.track.instrument = this.drumKit;
      let viewModel = this.sequencerService.createPatternCells(this.bars, this.projectViewModel.transportParams.quantization,
        this.projectViewModel.transportParams.bpm, this.projectViewModel.transportParams.signature, this.track.queue, this.drumKit.getNotes());
      this.projectViewModel.transportParams.tickStart = this.loopBarStart * MusicMath.getBarTicks(this.projectViewModel.transportParams.quantization,
        this.projectViewModel.transportParams.signature);
      this.projectViewModel.transportParams.tickEnd = this.loobBarEnd * MusicMath.getBarTicks(this.projectViewModel.transportParams.quantization, this.projectViewModel.transportParams.signature) - 1;
      this.projectViewModel.transport.beat.subscribe((tick) => this.onBeat(tick));
      this.projectViewModel.transport.time.subscribe((time) => this.onTime(time));

      let sequencerEvents = new CellEvents<CellInfo>();
      let barEvents = new CellEvents<CellInfo>();
      let svgElement = d3.select(this.container.nativeElement.querySelector("svg"));
      this.renderer = new SequencerD3(
        this.projectViewModel,
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
    this.renderer.updatePosition(this.projectViewModel.transport.getPositionInfo());
  }

  startTransport(): void {
    if (this.projectViewModel.transport.isRunning()) this.projectViewModel.transport.stop();
    else this.projectViewModel.transport.start();
  }

  quantize(length: NoteLength) {
    this.projectViewModel.transport.stop();
    this.projectViewModel.transportParams.quantization = length;
    let viewModel = this.sequencerService.createPatternCells(this.bars, this.projectViewModel.transportParams.quantization,
      this.projectViewModel.transportParams.bpm, this.projectViewModel.transportParams.signature, this.track.queue, this.drumKit.getNotes());
    this.renderer.render(viewModel);

  }

  ngOnDestroy(): void {
  }*/

}
