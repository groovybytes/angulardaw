import {ApiEndpoint} from "./ApiEndpoint";
import {Observable, of} from "rxjs";
import {LocalStorageArray} from "../../utils/LocalStorageArray";
import * as _ from "lodash";


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
    o["id"] = _.uniqueId();
    this.localStorage.add(o);
    this.localStorage.save();

    return of(o);
  }

  put(o: T): Observable<void> {
    this.localStorage.update(o, (_o) => _o["id"] === o["id"]);
    return of();
  }

  delete(id: any): Observable<void> {
    this.localStorage.delete((_o) => _o["id"] === id);
    return of();
  }

}