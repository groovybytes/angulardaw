import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() value:number=0;
  @Input() min:number=0;
  @Input() max:number=100;
  @Input() disabled:boolean=false;
  @Input() orientation:string="vertical";
  @Output() valueChanged:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    var lineHeight = ($('.drag-line').height())-15;

    $('.draggable-button').draggable({
      axis: 'y',
      containment: 'parent'
    });

    $('.draggable-button').on('drag', function(){
      var position = $('.draggable-button').position();
      var marginTop = position.top;
      $('.line').css({
        'clip': 'rect('+ marginTop +'px,8px, 183px,0px)'
      });

    });


    $('.fa-minus').on('click', function(){
      var position = $('.draggable-button').position();
      var marginTop = position.top;

      $('.line').css({
        'clip': 'rect('+ (marginTop+14) +'px,8px, 183px,0px)'
      });

      if( marginTop < lineHeight){
        $('.draggable-button').css({
          'top': marginTop + 14
        });

      }
    });

    $('.fa-plus').on('click', function(){
      var position = $('.draggable-button').position();
      var marginTop = position.top;

      $('.line').css({
        'clip': 'rect('+ (marginTop-14) +'px,8px, 183px,0px)'
      });

      if( marginTop > 0){

        $('.draggable-button').css({
          'top': marginTop - 14
        });
      }
    });



  }

  onChange(value:number):void{
    this.valueChanged.emit(value);
  }

}
