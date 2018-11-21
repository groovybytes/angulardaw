import {WindowPosition} from "./WindowPosition";
import {WindowState} from "./WindowState";
import {Subscription} from "rxjs";
import {DesktopWindow} from "./DesktopWindow";

export abstract class AbstractLayout {

  private subscriptions: Array<Subscription> = [];
  protected windows: Array<DesktopWindow> = [];

  constructor() {

  }


  abstract apply(): void;

  abstract reset(): void;

  open(id: string): void {
    this.getWindow(id).state.next(WindowState.NORMAL);
  }

  close(id: string): void {
    this.getWindow(id).state.next(WindowState.CLOSED);
  }

  setOrder(id: string, order: number): void {
    let window = this.getWindow(id);
    window.order = order;
  }

  bringToFront(id: string): void {
    let maximizedWindows = this.windows.filter(window => window.state.getValue() === WindowState.MAXIMIZED);
    //window.zIndexTmp=window.zIndex;
    this.getWindow(id).zIndex = 100 + maximizedWindows.length;
  }

  bringToBack(id: string): void {
    this.getWindow(id).zIndex = 1;
  }

  getWindows(): Array<DesktopWindow> {
    let result = [];
    this.windows.forEach(window => result.push(window));
    return result;
  }

  addWindow(id: string, order: number): DesktopWindow {
    let window1 = new DesktopWindow(id, WindowState.NORMAL, WindowPosition.LEFT);
    window1.order = order;
    this.windows.push(window1);
    this.subscriptions.push(window1.position.subscribe(() => this.windowPositionChanged(window1)));
    this.subscriptions.push(window1.state.subscribe(() => this.windowStateChanged(window1)));

    return window1;
  }

  addHeader(): DesktopWindow {
    let window1 = new DesktopWindow("_header", WindowState.NORMAL, WindowPosition.FIXED_TOP);
    this.windows.push(window1);
    this.subscriptions.push(window1.position.subscribe(() => this.windowPositionChanged(window1)));
    this.subscriptions.push(window1.state.subscribe(() => this.windowStateChanged(window1)));

    return window1;
  }

  addFooter(): DesktopWindow {
    let window1 = new DesktopWindow("_footer", WindowState.NORMAL, WindowPosition.FIXED_BOTTOM);
    this.windows.push(window1);
    this.subscriptions.push(window1.position.subscribe(() => this.windowPositionChanged(window1)));
    this.subscriptions.push(window1.state.subscribe(() => this.windowStateChanged(window1)));

    return window1;
  }


  destroy(): void {
    if (this.subscriptions) this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getWindow(id: string): DesktopWindow {
    return this.windows.find(window => window.id === id);
  }


  private windowPositionChanged(window: DesktopWindow): void {
    window.updateClass();
  }

  private windowStateChanged(window: DesktopWindow): void {
    window.updateClass();

    if (window.state.getValue() === WindowState.MAXIMIZED) {
      this.bringToFront(window.id);
    } else {
      this.bringToBack(window.id);

    }

  }

}
