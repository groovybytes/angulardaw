import {ApiEndpoint} from "./ApiEndpoint";
import {Observable, of} from "rxjs";

import * as _ from "lodash";
import {LocalStorageArray} from "../../../utils/LocalStorageArray";


export class InMemoryApiEndpoint<T> implements ApiEndpoint<T> {
  private localStorage: LocalStorageArray<T>;

  constructor(private key: string) {
    this.localStorage = new LocalStorageArray<T>(key);
  }

  get(id: any): Observable<T> {
    return of(this.localStorage.find(o => o["id"] === id)[0]);
  }

  find(params?: any): Observable<Array<T>> {

    if (!params) return of(this.localStorage.all());
    else
      return of(this.localStorage.find(o => {
        let keys = _.keys(params);
        let isValid: boolean = true;
        keys.forEach(key => isValid = isValid && o[key] === params[key]);

        return isValid;
      }));
  }

  post(o: T): Observable<T> {

    this.localStorage.add(o);

    return of(o);
  }

  put(o: T): Observable<void> {
    if (!o["id"]) console.warn("object has no id set");
    this.localStorage.update(o, (_o) => _o["id"] === o["id"]);
    return of();
  }

  delete(id: any): Observable<void> {
    this.localStorage.delete((_o) => _o["id"] === id);
    return of();
  }

  private  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

}
