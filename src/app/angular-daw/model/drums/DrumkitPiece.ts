import {Sample} from "../Sample";
import {Articulation} from "./Articulation";
import {DrumkitPieceCategory} from "./DrumkitPieceCategory";
import {MidiFilter} from "../midi/MidiFilter";

export class DrumkitPiece {
  category:DrumkitPieceCategory;
  sample:Sample;
  articulation:Articulation;
  filter:MidiFilter;

}
