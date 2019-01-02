import {DawEventCategory} from "./DawEventCategory";


export class DawEvent<T>{
  constructor(category: DawEventCategory, data?: T) {
    this.category = category;
    this.data = data;
  }

  category:DawEventCategory;
  data:T;

}
