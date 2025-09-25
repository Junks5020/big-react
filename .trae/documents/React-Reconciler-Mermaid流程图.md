# React Reconciler Mermaid 流程图集合

本文档包含了 React Reconciler 的详细 Mermaid 流程图，用于可视化展示整个协调器的工作流程。

## 1. 主要调用流程图

### 1.1 整体调用链路

```mermaid
flowchart TD
    A["应用启动"] --> B["createContainer()"]
    B --> C["创建 FiberRootNode"]
    C --> D["创建 hostRootFiber"]
    D --> E["初始化 updateQueue"]

    F["组件更新触发"] --> G["updateContainer()"]
    G --> H["创建 Update 对象"]
    H --> I["enqueueUpdate()"]
    I --> J["schedultUpdateOnFiber()"]

    J --> K["markUpdateFromFiberToRoot()"]
    K --> L["renderRoot()"]
    L --> M["prepareFreshStack()"]
    M --> N["workLoop()"]

    N --> O["performUnitOfWork()"]
    O --> P["beginWork()"]
    P --> Q{"有子节点?"}
    Q -->|是| R["设置 workInProgress = child"]
    Q -->|否| S["completeUnitOfWork()"]

    R --> O
    S --> T["completeWork()"]
    T --> U{"有兄弟节点?"}
    U -->|是| V["设置 workInProgress = sibling"]
    U -->|否| W["设置 workInProgress = return"]

    V --> O
    W --> X{"到达根节点?"}
    X -->|否| T
    X -->|是| Y["渲染完成"]

    style A fill:#e1f5fe
    style F fill:#e1f5fe
    style Y fill:#c8e6c9
```

### 1.2 函数调用时序图

```mermaid
sequenceDiagram
    participant App as 应用层
    participant Container as createContainer
    participant Update as updateContainer
    participant Scheduler as schedultUpdateOnFiber
    participant WorkLoop as workLoop
    participant BeginWork as beginWork
    participant CompleteWork as completeWork

    App->>Container: 创建容器
    Container->>Container: 创建 FiberRootNode
    Container->>Container: 创建 hostRootFiber
    Container->>Container: 初始化 updateQueue
    Container-->>App: 返回 root

    App->>Update: 触发更新(element, root)
    Update->>Update: 创建 Update 对象
    Update->>Update: enqueueUpdate
    Update->>Scheduler: schedultUpdateOnFiber

    Scheduler->>Scheduler: markUpdateFromFiberToRoot
    Scheduler->>WorkLoop: renderRoot
    WorkLoop->>WorkLoop: prepareFreshStack

    loop 工作循环
        WorkLoop->>WorkLoop: performUnitOfWork
        WorkLoop->>BeginWork: beginWork(fiber)
        BeginWork-->>WorkLoop: 返回子节点或null

        alt 有子节点
            WorkLoop->>WorkLoop: 继续处理子节点
        else 无子节点
            WorkLoop->>CompleteWork: completeUnitOfWork
            CompleteWork->>CompleteWork: completeWork

            alt 有兄弟节点
                CompleteWork->>WorkLoop: 处理兄弟节点
            else 无兄弟节点
                CompleteWork->>CompleteWork: 回到父节点
            end
        end
    end

    WorkLoop-->>App: 渲染完成
```

## 2. 工作循环详细流程图

### 2.1 workLoop 核心机制

```mermaid
flowchart TD
    A["开始 workLoop"] --> B{"workInProgress !== null?"}
    B -->|是| C["performUnitOfWork(workInProgress)"]
    B -->|否| D["工作循环结束"]

    C --> E["调用 beginWork(fiber)"]
    E --> F["更新 fiber.memoizedProps"]
    F --> G{"beginWork 返回值?"}

    G -->|有子节点| H["workInProgress = next"]
    G -->|null| I["调用 completeUnitOfWork(fiber)"]

    H --> B

    I --> J["let node = fiber"]
    J --> K["调用 completeWork(node)"]
    K --> L{"node.sibling !== null?"}

    L -->|是| M["workInProgress = node.sibling"]
    L -->|否| N["node = node.return"]

    M --> B
    N --> O{"node !== null?"}
    O -->|是| P["workInProgress = node"]
    O -->|否| Q["workInProgress = null"]

    P --> K
    Q --> B

    style A fill:#e3f2fd
    style D fill:#c8e6c9
    style Q fill:#ffcdd2
```

### 2.2 performUnitOfWork 详细流程

```mermaid
flowchart TD
    A["performUnitOfWork(fiber)"] --> B["调用 beginWork(fiber)"]
    B --> C["获取返回值 next"]
    C --> D["fiber.memoizedProps = fiber.pendingProps"]
    D --> E{"next === null?"}

    E -->|否| F["workInProgress = next"]
    E -->|是| G["调用 completeUnitOfWork(fiber)"]

    F --> H["继续处理子节点"]

    G --> I["开始归阶段处理"]
    I --> J["处理兄弟节点或父节点"]

    style A fill:#e8f5e8
    style H fill:#fff3e0
    style J fill:#f3e5f5
```

## 3. 双缓冲机制流程图

### 3.1 createWorkInProgress 双缓冲实现

```mermaid
flowchart TD
    A["createWorkInProgress(current, pendingProps)"] --> B["获取 current.alternate"]
    B --> C{"alternate === null?"}

    C -->|是 - 首次渲染| D["创建新的 FiberNode"]
    C -->|否 - 更新渲染| E["复用 alternate 节点"]

    D --> F["设置基本属性"]
    F --> G["wip.stateNode = current.stateNode"]
    G --> H["建立双向连接"]
    H --> I["wip.alternate = current"]
    I --> J["current.alternate = wip"]

    E --> K["更新 pendingProps"]
    K --> L["重置 flags"]
    L --> M["wip.flags = NoFlags"]

    J --> N["复制其他属性"]
    M --> N
    N --> O["wip.type = current.type"]
    O --> P["wip.updateQueue = current.updateQueue"]
    P --> Q["wip.child = current.child"]
    Q --> R["wip.memoizedState = current.memoizedState"]
    R --> S["wip.memoizedProps = current.memoizedProps"]
    S --> T["返回 workInProgress 节点"]

    style D fill:#e1f5fe
    style E fill:#f3e5f5
    style T fill:#c8e6c9
```

### 3.2 双缓冲树切换机制

```mermaid
flowchart LR
    subgraph "Current Tree"
        A1["FiberRootNode"]
        B1["HostRoot Fiber"]
        C1["App Fiber"]
        D1["div Fiber"]

        A1 --> B1
        B1 --> C1
        C1 --> D1
    end

    subgraph "WorkInProgress Tree"
        A2["FiberRootNode"]
        B2["HostRoot Fiber"]
        C2["App Fiber"]
        D2["div Fiber"]

        A2 --> B2
        B2 --> C2
        C2 --> D2
    end

    B1 -."alternate".-> B2
    C1 -."alternate".-> C2
    D1 -."alternate".-> D2

    B2 -."alternate".-> B1
    C2 -."alternate".-> C1
    D2 -."alternate".-> D1

    E["渲染完成后切换"] --> F["current = workInProgress"]
```

## 4. 更新队列处理流程图

### 4.1 更新队列操作流程

```mermaid
flowchart TD
    A["组件状态更新"] --> B["createUpdate(action)"]
    B --> C["创建 Update 对象"]
    C --> D["enqueueUpdate(updateQueue, update)"]
    D --> E["updateQueue.shared.pending = update"]

    E --> F["schedultUpdateOnFiber"]
    F --> G["开始工作循环"]
    G --> H["processUpdateQueue"]

    H --> I{"pendingUpdate !== null?"}
    I -->|否| J["返回 baseState"]
    I -->|是| K["获取 update.action"]

    K --> L{"action 类型?"}
    L -->|函数| M["result = action(baseState)"]
    L -->|值| N["result = action"]

    M --> O["返回新状态"]
    N --> O
    J --> O

    style A fill:#e3f2fd
    style O fill:#c8e6c9
```

### 4.2 Update 对象结构图

```mermaid
classDiagram
    class Update {
        +Action~State~ action
    }

    class UpdateQueue {
        +shared: SharedQueue
    }

    class SharedQueue {
        +Update~State~ pending
    }

    UpdateQueue --> SharedQueue
    SharedQueue --> Update

    note for Update "包含状态更新的动作\n可以是新值或更新函数"
    note for UpdateQueue "每个 Fiber 节点的更新队列\n管理该节点的所有更新"
    note for SharedQueue "共享的更新队列\n当前实现为单个 pending 更新"
```

## 5. Fiber 树遍历流程图

### 5.1 深度优先遍历策略

```mermaid
flowchart TD
    A["开始遍历 Root"] --> B["当前节点: Root"]
    B --> C{"有 child?"}

    C -->|是| D["进入 child"]
    C -->|否| E["开始 complete"]

    D --> F["beginWork(child)"]
    F --> G["当前节点: child"]
    G --> C

    E --> H["completeWork(current)"]
    H --> I{"有 sibling?"}

    I -->|是| J["进入 sibling"]
    I -->|否| K{"有 parent?"}

    J --> L["beginWork(sibling)"]
    L --> M["当前节点: sibling"]
    M --> C

    K -->|是| N["回到 parent"]
    K -->|否| O["遍历完成"]

    N --> P["当前节点: parent"]
    P --> I

    style A fill:#e3f2fd
    style O fill:#c8e6c9
    style F fill:#fff3e0
    style H fill:#f3e5f5
```

### 5.2 Fiber 节点关系图

```mermaid
flowchart TD
    subgraph "Fiber Tree Structure"
        A["Parent Fiber"]
        B["Child1 Fiber"]
        C["Child2 Fiber"]
        D["Child3 Fiber"]
        E["Grandchild Fiber"]

        A -->|child| B
        B -->|sibling| C
        C -->|sibling| D
        B -->|child| E

        B -->|return| A
        C -->|return| A
        D -->|return| A
        E -->|return| B
    end

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#fff3e0
    style E fill:#f3e5f5
```

## 6. 错误处理和恢复流程

### 6.1 workLoop 错误处理机制

```mermaid
flowchart TD
    A["开始 renderRoot"] --> B["prepareFreshStack"]
    B --> C["进入 do-while 循环"]
    C --> D["try { workLoop() }"]

    D --> E{"是否发生错误?"}
    E -->|否| F["正常完成工作"]
    E -->|是| G["catch 错误"]

    G --> H["console.warn('workLoop 发生错误')"]
    H --> I["workInProgress = null"]
    I --> J["重置工作状态"]

    J --> K{"需要重试?"}
    K -->|是| C
    K -->|否| L["错误恢复完成"]

    F --> M["渲染成功"]

    style G fill:#ffcdd2
    style H fill:#ffcdd2
    style I fill:#ffcdd2
    style M fill:#c8e6c9
```

## 7. 总结

这些 Mermaid 流程图全面展示了 React Reconciler 的工作机制：

1. **主要调用流程图**：展示了从应用启动到渲染完成的完整调用链路
2. **工作循环详细流程图**：深入展示了 workLoop 的核心机制和 performUnitOfWork 的处理逻辑
3. **双缓冲机制流程图**：说明了 createWorkInProgress 的实现和双缓冲树的切换机制
4. **更新队列处理流程图**：展示了状态更新的处理流程和数据结构
5. **Fiber 树遍历流程图**：说明了深度优先遍历策略和节点关系
6. **错误处理流程图**：展示了错误恢复机制

这些流程图为理解 React Reconciler 的工作原理提供了清晰的可视化参考。
