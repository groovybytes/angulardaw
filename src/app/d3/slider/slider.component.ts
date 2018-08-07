/*
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})


export class SliderComponent  {
  private _active:boolean=false;
  private slider:any;

  @Output() activeChanged = new EventEmitter<boolean>();
  @Input('min') min: number;
  @Input('max') max: number;
  @Input('steps') steps: number;
  @Input('startPosition') startPosition: number;
  @Input('active')
  set active(value: boolean) {
    this._active = value;
    this.update();
    this.activeChanged.emit(this._active);

  }

  get active() {
    return this._active;
  }

  @Output() positionChanged = new EventEmitter<number>();

  constructor(private element:ElementRef){
  }

  /!*ngOnInit() {
    let self = this;
    var margin = {left: 20, right: 20},
      tickWidth = 1200,
      tickHeight = 50,
      range = [this.min, this.max],
      step = this.steps; // change the step and if null, it'll switch back to a normal slider

    // append svg
    var svg = d3.select(this.element.nativeElement.querySelector("svg"))
      .attr('tickWidth', tickWidth)
      .attr('tickHeight', tickHeight);

    var slider =svg.append('g')
      .classed('slider', true)
      .attr('transform', 'translate(' + margin.left + ', ' + (tickHeight / 2) + ')');

    // using clamp here to avoid slider exceeding the range limits
    var xScale = d3.scaleLinear()
      .domain(range)
      .range([0, tickWidth - margin.left - margin.right])
      .clamp(true);

    xScale(xScale.invert(80));

    // array useful for step sliders
    var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
    var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
      return d;
    });

    xScale.clamp(true);
    // drag behavior initialization
    var drag = d3.drag()
      .on('start.interrupt', function () {
        slider.interrupt();
      }).on('start drag', function () {
        dragged(d3.event.x);
        self.active=true;

      });

    // this is the main bar with a stroke (applied through CSS)
    var track = slider.append('line').attr('class', 'track')
      .attr('x1', xScale.range()[0])
      .attr('x2', xScale.range()[1]);

    // this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
    var trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

    var ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
      .call(xAxis);

    // drag handle
    var handle = self.slider =slider.append('circle').classed('handle', true)
      .attr('r', 8);

    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
      .call(drag);

    dragged(xScale(this.startPosition));
    this.update();

    function dragged(value) {
      var x = xScale.invert(value), index = null, midPoint, cx, xVal;
      if (step) {
        // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
        for (var i = 0; i < rangeValues.length - 1; i++) {
          if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
            index = i;
            break;
          }
        }
        midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
        if (x < midPoint) {
          cx = xScale(rangeValues[index]);
          xVal = rangeValues[index];
        } else {
          cx = xScale(rangeValues[index + 1]);
          xVal = rangeValues[index + 1];
        }
      } else {
        // if step is null or 0, return the drag value as is
        cx = xScale(x);
        xVal = x.toFixed(3);
      }
      // use xVal as drag value
      handle.attr('cx', cx);
      self.positionChanged.next(xVal);
    }
  }*!/

  update():void{
    if (this.slider) this.slider.classed("active",this.active);
  }

}
*/
