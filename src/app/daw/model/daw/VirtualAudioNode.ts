export class VirtualAudioNode<T extends AudioNode> {
  id: string;
  target: VirtualAudioNode<any>;
  sources: Array<VirtualAudioNode<any>> = [];
  node: T;
  meta:string;

  constructor(id: string, node: T,meta:string) {
    this.node = node;
    this.id = id;
    this.meta=meta;
  }

  connect(node: VirtualAudioNode<any>): void {
    this.target = node;
    node.sources.push(this);
    this.node.connect(node.node);
  }


}
