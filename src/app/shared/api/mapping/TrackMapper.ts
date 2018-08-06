import {TrackDto} from "../TrackDTO";
import {Track} from "../../../model/daw/Track";
import {TrackCategory} from "../../../model/daw/TrackCategory";
import {TransportEvents} from "../../../model/daw/events/TransportEvents";
import {TransportInfo} from "../../../model/daw/TransportInfo";

export class TrackMapper {


  static toJSON(track: Track): TrackDto {
    let trackDTO={id:track.id,index:0,name:"",category:0,projectId:track.projectId,pluginId:""};
    trackDTO.id = track.id;
    trackDTO.index = track.index;
    trackDTO.name = "";
    trackDTO.category = track.category;
    trackDTO.pluginId=track.plugins[0]?track.plugins[0].getId():null;

    return trackDTO;
  }

  static fromJSON(trackDto: TrackDto, transportEvents:TransportEvents, transportInfo:TransportInfo): Track {
    let newTrack:Track=new Track(trackDto.projectId,transportEvents,transportInfo);
    newTrack.id = trackDto.id;
    newTrack.name = trackDto.name;
    newTrack.index = trackDto.index;
    newTrack.projectId=trackDto.projectId;

    return newTrack;

  }
}
