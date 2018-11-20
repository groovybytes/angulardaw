import {Injectable} from "@angular/core";
import {DesktopDto} from "../../model/daw/dto/DesktopDto";
import {WindowDto} from "../../model/daw/dto/WindowDto";
import {Layout} from "../../model/daw/visual/desktop/Layout";
import {LayoutFactory} from "../../model/daw/visual/desktop/LayoutFactory";
import {AbstractLayout} from "../../model/daw/visual/desktop/AbstractLayout";
import {WindowInfo} from "../../model/daw/visual/desktop/WindowInfo";

@Injectable()
export class LayoutManagerService {

  private layout: AbstractLayout;

  serialize(): DesktopDto {
    let dto = new DesktopDto();
    dto.layout = this.layout.getId();
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

  getLayout():Layout{
    return this.layout.getId();
  }

  deSerialize(dto: DesktopDto): void {

    this.setLayout(dto.layout);

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
    this.setLayout(Layout.VERTICAL);

    this.addWindow("matrix", 0);
    this.addWindow("sequencer", 1);
    this.addWindow("plugin", 2);

    this.layout.apply();
  }

  setLayout(id: Layout): void {
    if (this.layout) this.layout.destroy();
    this.layout = LayoutFactory.create(id);
  }

  getWindow(id: string): WindowInfo {
    return this.layout.getWindow(id).getInfo();
  }

  addWindow(id: string, order: number): WindowInfo {
    this.layout.addWindow(id, order);
    return this.getWindow(id);
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


}
