import {EventDTO} from "./EventDTO";

export interface TrackDTO{
  id: any;
  index: number;
  name: string;
  events: EventDTO[];
}
