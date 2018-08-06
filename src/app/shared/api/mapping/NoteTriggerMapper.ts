import {PerformanceEvent} from "../../../model/daw/events/PerformanceEvent";
import {NoteTrigger} from "../../../model/mip/NoteTrigger";
import {NoteTriggerDto} from "../NoteTriggerDto";
import {TransportPosition} from "../../../model/daw/TransportPosition";

export class NoteTriggerMapper {

  static toJSON(event: PerformanceEvent<NoteTrigger>): NoteTriggerDto {

    return new NoteTriggerDto(event.id,event.data.note,event.time,event.data.length,event.data.loudness,event.data.articulation);
  }

  static fromJSON(dto: NoteTriggerDto): PerformanceEvent<NoteTrigger> {
    let event = new PerformanceEvent<NoteTrigger>();
    event.id=dto.id;
    event.time=dto.time;
    event.data.articulation=dto.articulation;
    event.data.loudness=dto.loudness;
    event.data.length=dto.length;
    event.data.note=dto.note;

    return event;
  }
}
