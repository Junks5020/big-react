import { Props, Key, Ref, Type } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
  tag: WorkTag;
  key: Key;
  stateNode: any;
  type: Type;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  pendingPorps: Props;
  memoizedProps: Props | null;
  alternate: FiberNode | null;
  flags: Flags;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    //stateNode 是什么意思？ -》》  表示当前fiber节点对应的真实dom节点
    this.stateNode = null;
    //type是当前fiber节点的类型，例如FunctionComponent、HostComponent等
    // 和tag的差别是什么？ -》》 tag是当前fiber节点的工作类型，type是当前fiber节点的类型，例如FunctionComponent、HostComponent等
    this.type = null;

    //ref 是当前fiber节点的ref，ref是当前fiber节点的引用，例如ref={this.ref}
    this.ref = null;

    //构成树状结构

    //return 是当前fiber节点的父节点
    this.return = null;
    //sibling 是当前fiber节点的兄弟节点
    this.sibling = null;
    //child 是当前fiber节点的子节点
    this.child = null;
    //index 是当前fiber节点在父节点中的索引
    this.index = 0;

    //作为工作单元

    //pendingProps 是当前fiber节点的pendingProps，pendingProps是当前fiber节点的props，但是还没有被应用到真实dom节点上
    this.pendingPorps = pendingProps;
    this.memoizedProps = null;

    this.alternate = null;
    this.flags = NoFlags;
  }
}

export class FIberRootNode {
  container: Container;
}
