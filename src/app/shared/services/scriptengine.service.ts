import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptEngine{

  constructor() { }

  setImmediate(fn:()=>void):void{
    Promise.resolve().then(()=>fn());
  }
}
