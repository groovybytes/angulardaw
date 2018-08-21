export class Trigger<T,S>{
  constructor(
    private _test:(condition:T)=>boolean,
    private _subject:()=>S,
    private _resolve:(subject:S)=>void){

  }
  test(condition:T):boolean{
    return this._test(condition);
  }

  subject():S{
    return this._subject();
  }
  resolve():void{
    return this._resolve(this._subject());
  }
}
