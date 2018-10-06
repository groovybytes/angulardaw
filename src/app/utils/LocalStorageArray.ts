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
    return _.cloneDeep(this.data.filter(d=>{
      debugger;
      return finder(d)
    }));
  }

  add(o:T):void{
    this.data.push(_.cloneDeep(o));
    this.save();
  }

  update(o:T,finder:(o:T)=>boolean):void{
    let index = this.data.findIndex(finder);
    if (index>=0) this.data.splice(index,1,_.cloneDeep(o));
    this.save();
  }

  delete(finder:(o:T)=>boolean):void{
    let index = this.data.findIndex(finder);
    if (index>=0) this.data.splice(index,1);

    this.save();
  }

  save(): void {
    localStorage.setItem(this.id,JSON.stringify(this.data));
  }

 /* projectViewModel.id=_.uniqueId();*/
}
