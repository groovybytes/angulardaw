import {Injectable} from "@angular/core";
import {WindowPosition} from "../../model/daw/visual/desktop/WindowPosition";
import {WindowSpecs} from "../../model/daw/visual/desktop/WindowSpecs";
import {WindowState} from "../../model/daw/visual/desktop/WindowState";
import {DesktopDto} from "../../model/daw/dto/DesktopDto";
import {WindowDto} from "../../model/daw/dto/WindowDto";
import {Subscription} from "rxjs";

@Injectable()
export class LayoutManagerService {

  private layout: number = 0;

  readonly windows: Array<WindowSpecs> = [];
  private subscriptions: Array<Subscription> = [];

  serialize(): DesktopDto {
    let dto = new DesktopDto();
    dto.layout = this.layout;
    dto.windows = [];
    this.windows.forEach(window => {
      let windowDto = new WindowDto();
      windowDto.height = window.height;
      windowDto.width = window.width;
      windowDto.id = window.id;
      windowDto.position = window.position.getValue();
      windowDto.state = window.state.getValue();
      windowDto.x = window.x;
      windowDto.y = window.y;
      windowDto.clazz = window.clazz;
      windowDto.zIndex = window.zIndex;
      dto.windows.push(windowDto);
    });

    return dto;
  }

  deSerialize(dto: DesktopDto): void {
    this.reset();

    dto.windows.forEach(windowDto => {
      let window = this.addWindow(windowDto.id);
      window.x = windowDto.x;
      window.y = windowDto.y;
      window.width = windowDto.width;
      window.height = windowDto.height;
      window.clazz = windowDto.clazz;
      window.position.next(windowDto.position);
      window.state.next(windowDto.state);
      window.zIndex = windowDto.zIndex ? windowDto.zIndex : 1;
    });

    this.setLayout(dto.layout);
  }

  createDefaultLayout(): void {
    let matrix = this.addWindow("matrix");
    let sequencer = this.addWindow("sequencer");
    sequencer.position.next(WindowPosition.BOTTOM);
    sequencer.state.next(WindowState.NORMAL);
    matrix.position.next(WindowPosition.TOP);
    matrix.state.next(WindowState.NORMAL);
  }

  reset(): void {
    this.layout = 0;
    this.windows.length = 0;
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLayout(id: number): void {
    if (id === 0) {
      this.layout = 0;
      this.getWindow("sequencer").position.next(WindowPosition.BOTTOM);
      this.getWindow("matrix").position.next(WindowPosition.TOP);
    }
    else {
      this.layout = 1;
      this.getWindow("sequencer").position.next(WindowPosition.RIGHT);
      this.getWindow("matrix").position.next(WindowPosition.LEFT);
    }
  }

  getLayout(): number {
    return this.layout;
  }

  getWindow(id: string): WindowSpecs {
    return this.windows.find(window => window.id === id);
  }

  updateWindowClass(id: string): string {
    let window = this.getWindow(id);
    window.clazz = "window";
    if (window.position.getValue() === WindowPosition.TOP) window.clazz += " window-top";
    else if (window.position.getValue() === WindowPosition.BOTTOM) window.clazz += " window-bottom";
    else if (window.position.getValue() === WindowPosition.LEFT) window.clazz += " window-left";
    else if (window.position.getValue() === WindowPosition.RIGHT) window.clazz += " window-right";

    if (window.state.getValue() === WindowState.CLOSED) window.clazz += " window-closed";
    else if (window.state.getValue() === WindowState.MAXIMIZED) window.clazz += " window-maximized";
    else if (window.state.getValue() === WindowState.MINIMIZED) window.clazz += " window-minimized";

    return window.clazz;
  }

  bringToFront(id: string): void {
    let maximizedWindows = this.windows.filter(window => window.state.getValue() === WindowState.MAXIMIZED);
    //window.zIndexTmp=window.zIndex;
    this.getWindow(id).zIndex = 100 + maximizedWindows.length;
  }

  bringToBack(id: string): void {
    this.getWindow(id).zIndex = 1;
  }

  addWindow(id: string): WindowSpecs {
    let specs = new WindowSpecs(id, WindowState.NORMAL, WindowPosition.LEFT);
    this.windows.push(specs);
    this.subscriptions.push(specs.position.subscribe(() => this.windowPositionChanged(specs)));
    this.subscriptions.push(specs.state.subscribe(() => this.windowStateChanged(specs)));

    return specs;
  }

  isOpen(id: string): boolean {
    let window = this.getWindow(id);
    return window ? window.state.getValue() === WindowState.NORMAL : false;
  }

  getOpenWindows(): Array<WindowSpecs> {
    return this.windows.filter(window => window.state.getValue() === WindowState.NORMAL);
  }

  openWindow(id: string): void {
    let window = this.getWindow(id);
    if (window) window.state.next(WindowState.NORMAL);
  }

  closeWindow(id: string): void {
    let window = this.getWindow(id);
    if (window) window.state.next(WindowState.CLOSED);
  }

  toggleWindow(id: string): void {
    let window = this.getWindow(id);
    if (window) {
      if (window.state.getValue() != WindowState.NORMAL) window.state.next(WindowState.NORMAL);
      else window.state.next(WindowState.CLOSED);
    }

  }

  private windowPositionChanged(window: WindowSpecs): void {
    this.updateWindowClass(window.id);

  }

  private windowStateChanged(window: WindowSpecs): void {
    this.updateWindowClass(window.id);

    if (window.state.getValue() === WindowState.MAXIMIZED) {
      this.bringToFront(window.id);
    }
    else {
      this.bringToBack(window.id);

    }

  }
}
