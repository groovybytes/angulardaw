import {Workstation} from "../model/daw/Workstation";

export abstract class DawPlugin {

  abstract workstation:Workstation;


  abstract defaultWidth(): number;

  abstract defaultHeight(): number;

  abstract id(): string;

  abstract title(): string;

  abstract activate(): void;

  abstract destroy(): void;


}
