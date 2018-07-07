export class ViewReference {
  id:string;
  title:string;
  icon:string;
  index:number=0;

  constructor(id: string, title: string, icon: string, index: number) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.index = index;
  }



}
