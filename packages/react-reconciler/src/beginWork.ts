import { ReactElement } from 'react';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostText, HostRoot } from './workTags';

export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    //计算状态的最新值、创造子fiberNode
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      //创建子fiberNode

      return updateHostComponent(wip);
    case HostText:
      return null;

    default:
      if (__DEV__) {
        console.warn('beginWork 未处理的 tag', wip.tag);
      }
  }
};

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;

  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingPorps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FiberNode, children: ReactElement) {
  const current = wip.alternate;

  reconcileChildFibers(wip, current?.child, children);
}
