/*
import {Component, ElementRef, OnInit} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-bpm-circle',
  templateUrl: './bpm-circle.component.html',
  styleUrls: ['./bpm-circle.component.scss']
})
export class BpmCircleComponent {

  constructor(private element:ElementRef) { }

/!*  ngOnInit() {

    let tickWidth = 800;
    let tickHeight=800;
    let svg = d3.select(this.element.nativeElement).append("svg")
      .attr("tickWidth", tickWidth)
      .attr("tickHeight", tickHeight)


      svg.append("rect")
        .attr("tickWidth","100%")
        .attr("tickHeight","100%")
        .attr("class","background");

    let container = svg.append("g").attr("transform","translate("+(tickWidth/2)+" "+(tickHeight/2)+") scale(2,2)")

    let arcGenerator = d3.arc()
      .innerRadius(120)
      .outerRadius(150)
      .padAngle(.01)
      .padRadius(150)
      .cornerRadius(4);


    let unitAngle=(2 * Math.PI)/180;

    let arcData = [];
    let colors=["blue","red","green","yellow","orange"];
    let j = 0;
    for (let i=0;i<2*Math.PI;i+=unitAngle){
      arcData.push({color:colors[j],label:j,startAngle:i,endAngle:i+unitAngle});
      j++;
    }

    container
      .selectAll('path')
      .data(arcData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr("id",(d,i)=>"path"+i)
      .attr("fill",(d)=>d.color)

    container.append("circle").attr("fill","black").attr("r",20)
      .attr("cx",()=>arcGenerator.centroid(arcData[0])[0])
      .attr("cy",()=>arcGenerator.centroid(arcData[0])[1])

    container.append("circle").attr("fill","black").attr("r",20)
      .attr("cx",()=>0)
      .attr("cy",()=>0)


    container
      .selectAll('text')
      .data(arcData)
      .enter()
      .append('text')
      .attr("dx", 0)
      .attr("dy", 0)
      .append('textPath')
      .attr("xlink:href", function(d,i) { return "#path" + i; })
      .text(function(d,i) { })//console.log(i);return "x" })
 /!*     .style("fill", function(d) { return d3.rgb(fill(d.index)).darker(2); })*!/
    /!*  .each(function(d) {
        let centroid = arcGenerator.centroid(d);
        d3.select(this)
          .attr('x', centroid[0]*1.2)
          .attr('y', centroid[1]*1.2)
          .attr('dy', '0.33em')
          .text(d.label);
      });*!/

    svg.call(d3.drag().on("drag", (d)=>{
      //console.log(d3.event.dy);
    }));

  }*!/

}
*/
