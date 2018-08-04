import {TrackDto} from "../TrackDTO";
import {Track} from "../../../model/daw/Track";
import {MidiTrack} from "../../../model/daw/MidiTrack";
import {TrackCategory} from "../../../model/daw/TrackCategory";
import {ClickTrack} from "../../../model/daw/ClickTrack";
import {TransportEvents} from "../../../model/daw/TransportEvents";
import {TransportInfo} from "../../../model/daw/TransportInfo";

export class TrackMapper {
  static toJSON(projectId:any,track: Track): TrackDto {
    let trackDTO={id:0,index:0,name:"",category:0,projectId:0,instrumentId:""};
    trackDTO.id = track.id;
    trackDTO.index = track.index;
    trackDTO.name = "";
    trackDTO.category = track.category;
    trackDTO.projectId=projectId;
    trackDTO.instrumentId=track.instrument.getId();

    return trackDTO;
  }

  static fromJSON(trackDto: TrackDto, transportEvents:TransportEvents, transportInfo:TransportInfo): Track {
    let newTrack:Track;

    if (trackDto.category===TrackCategory.MIDI) {
      newTrack=new MidiTrack(transportEvents,transportInfo);
    }
    else if (trackDto.category===TrackCategory.CLICK){
      newTrack=new ClickTrack(transportEvents,transportInfo);
    }
    else throw new Error("invalid track category");

    newTrack.id = trackDto.id;
    newTrack.name = trackDto.name;
    newTrack.index = trackDto.index;

    return newTrack;

  }
}
