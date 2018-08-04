declare var _;
export class LocalStorageArray<T> {

  private data: Array<T>;

  constructor(private id: string) {
    let storageData = localStorage.getItem(this.id);
    this.data = storageData ? JSON.parse(storageData) : [];
  }

  all():Array<T>{
    return _.cloneDeep(this.data);
  }
  find(finder:(o:T)=>boolean):Array<T>{
    return _.cloneDeep(this.data.filter(d=>finder(d)));
  }

  add(o:T):void{
    this.data.push(_.cloneDeep(o));
  }

  update(o:T,finder:(o:T)=>boolean):void{
    let index = this.data.findIndex(finder);
    if (index>=0) this.data.splice(index,1,_.cloneDeep(o));
  }

  delete(finder:(o:T)=>boolean):void{
    let index = this.data.findIndex(finder);
    if (index>=0) this.data.splice(index,1);
  }

  save(): void {
    localStorage.setItem(this.id,JSON.stringify(this.data));
  }

 /* project.id=_.uniqueId();*/
}
