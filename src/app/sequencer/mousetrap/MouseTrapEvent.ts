export class MouseTrapEvent{
  event:MouseEvent;
  element:HTMLElement;

  constructor(event: MouseEvent) {
    this.event = event;
    this.element=<HTMLElement>event.target;
  }
}
