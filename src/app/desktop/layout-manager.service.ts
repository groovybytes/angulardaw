import {Injectable} from "@angular/core";
import {DesktopDto} from "../model/daw/dto/DesktopDto";
import {WindowDto} from "../model/daw/dto/WindowDto";
import {AbstractLayout} from "./model/AbstractLayout";
import {WindowInfo} from "./model/WindowInfo";
import {WindowState} from "./model/WindowState";
import {DesktopWindow} from "./model/DesktopWindow";
import * as _ from "lodash";

@Injectable()
export class LayoutManagerService {

  private layout: AbstractLayout;
  private readonly animationTimeout: number = 1000;

  applyLayout(): void {
    this.layout.apply();
  }

  reset(): void {
    this.layout.reset();
  }

  serialize(): DesktopDto {
    let dto = new DesktopDto();
    dto.windows = [];
    this.layout.getWindows().forEach(window => {
      let windowDto = new WindowDto();
      windowDto.id = window.id;
      windowDto.order = window.order;
      windowDto.position = window.position.getValue();
      windowDto.state = window.state.getValue();
      windowDto.clazz = window.clazz;
      windowDto.zIndex = window.zIndex;
      dto.windows.push(windowDto);
    });

    return dto;
  }


  deSerialize(dto: DesktopDto): void {

    dto.windows.forEach(windowDto => {

      let window = this.layout.addWindow(windowDto.id, windowDto.order);
      window.clazz = windowDto.clazz;
      window.position.next(windowDto.position);
      window.state.next(windowDto.state);
      window.zIndex = windowDto.zIndex ? windowDto.zIndex : 1;
    });

    this.layout.apply();

  }

  createDefaultLayout(): void {
    this.addWindow("matrix", 0);
    this.addWindow("sequencer", 1);
    this.addWindow("plugin", 2);

    this.layout.apply();
  }


  getWindows(): Array<WindowInfo> {
    return this.layout.getWindows().map(window => window.getInfo());
  }

  getWindowInfo(id: string): WindowInfo {
    return this.layout.getWindow(id).getInfo();
  }

  getWindow(id: string): DesktopWindow {
    return this.layout.getWindow(id);
  }

  addWindow(id: string, order: number): WindowInfo {
    this.layout.addWindow(id, order);
    return this.getWindow(id).getInfo();
  }
  addWindowWithOrder(order: number): WindowInfo {
    let id = _.uniqueId("window");
    this.layout.addWindow(id, order);
    return this.getWindow(id).getInfo();
  }

  addHeader(): WindowInfo {
    return this.layout.addHeader().getInfo();
  }
  addFooter(): WindowInfo {
    return this.layout.addFooter().getInfo();
  }

  setOrder(id: string, order: number): void {
    this.layout.setOrder(id, order);
  }

  closeWindow(id: string): void {
    this.layout.close(id);
  }

  openWindow(id: string): void {
    this.layout.open(id);
  }

  minimize(id: string): void {
    let window = this.layout.getWindow(id);
    window.clazz += " animated slideOutDown";
    this.layout.bringToFront(id);
    setTimeout(() => {
      window.state.next(WindowState.MINIMIZED);
      this.layout.bringToBack(window.id);
    }, this.animationTimeout)
  }

  maximize(id: string): void {
    let window = this.layout.getWindow(id);
    this.layout.bringToFront(id);
    window.state.next(WindowState.MAXIMIZED);

    if (window.state.getValue() === WindowState.MINIMIZED) window.clazz += " animated slideInUp";
  }


}
