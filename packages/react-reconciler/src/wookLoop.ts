import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderRoot(root: FiberNode) {
  //初始化，
  prepareFreshStack(root);
  //递归流程
  do {
    try {
      workLoop();
    } catch (error) {
      console.warn('workLoop 发生错误', error);
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);

  fiber.memoizedProps = fiber.pendingPorps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return!;
    workInProgress = node;
  } while (node !== null);
}
