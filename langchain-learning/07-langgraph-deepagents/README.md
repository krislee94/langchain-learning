# 第七章：LangGraph + LangSmith + Deep Agents 体系化实战

> 掌握 LangChain 生态的三大核心工具

---

## 📌 本章学习目标

- 深入理解 LangGraph 的状态图编排
- 掌握 LangSmith 的观测和调试能力
- 学会使用 Deep Agents 构建复杂应用
- 能够整合三个工具构建完整系统

---

## 7.1 LangGraph 深度实战

### 7.1.1 StateGraph 基础

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List

# 定义状态
class AgentState(TypedDict):
    messages: List[dict]
    current_step: str
    data: dict
    errors: List[str]

# 创建图
graph = StateGraph(AgentState)

# 定义节点
def node_a(state: AgentState):
    print("执行节点 A")
    return {"current_step": "A", "data": {"processed": True}}

def node_b(state: AgentState):
    print("执行节点 B")
    return {"current_step": "B"}

# 添加节点
graph.add_node("process_a", node_a)
graph.add_node("process_b", node_b)

# 添加边
graph.add_edge(START, "process_a")
graph.add_edge("process_a", "process_b")
graph.add_edge("process_b", END)

# 编译
app = graph.compile()

# 执行
result = app.invoke({
    "messages": [],
    "current_step": "start",
    "data": {},
    "errors": []
})
```

### 7.1.2 条件分支

```python
from typing import Literal

def router(state: AgentState) -> Literal["path_a", "path_b"]:
    """根据状态路由"""
    if state["data"].get("type") == "A":
        return "path_a"
    return "path_b"

graph = StateGraph(AgentState)
graph.add_node("route", router)
graph.add_node("path_a", lambda s: {"result": "A"})
graph.add_node("path_b", lambda s: {"result": "B"})

graph.add_edge(START, "route")
graph.add_conditional_edges(
    "route",
    router,
    {
        "path_a": "path_a",
        "path_b": "path_b",
    }
)
graph.add_edge("path_a", END)
graph.add_edge("path_b", END)
```

### 7.1.3 循环和重试

```python
def process_with_retry(state: AgentState) -> dict:
    """带重试的处理"""
    errors = state.get("errors", [])
    retry_count = len(errors)
    
    if retry_count >= 3:
        return {"current_step": "failed"}
    
    try:
        # 处理逻辑
        result = do_something()
        return {"data": result, "current_step": "success"}
    except Exception as e:
        errors.append(str(e))
        return {"errors": errors, "current_step": "retry"}

graph = StateGraph(AgentState)
graph.add_node("process", process_with_retry)
graph.add_node("success", lambda s: {"result": "done"})
graph.add_node("failed", lambda s: {"result": "failed"})

graph.add_edge(START, "process")

# 条件边：重试或结束
graph.add_conditional_edges(
    "process",
    lambda s: s["current_step"],
    {
        "success": "success",
        "retry": "process",  # 循环回 process
        "failed": "failed",
    }
)

graph.add_edge("success", END)
graph.add_edge("failed", END)
```

### 7.1.4 持久化

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver

# 内存检查点（开发）
memory = MemorySaver()
app = graph.compile(checkpointer=memory)

# SQLite 检查点（生产）
with SqliteSaver.from_conn_string("checkpoints.sqlite") as saver:
    app = graph.compile(checkpointer=saver)
    
    # 使用线程 ID
    config = {"configurable": {"thread_id": "user-123"}}
    
    # 第一次调用
    app.invoke({"messages": [{"role": "user", "content": "你好"}]}, config)
    
    # 后续调用会记住历史
    app.invoke({"messages": [{"role": "user", "content": "继续"}]}, config)
```

---

## 7.2 LangSmith 观测平台

### 7.2.1 启用追踪

```python
import os

# 设置环境变量
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "lsv2_..."
os.environ["LANGSMITH_PROJECT"] = "my-project"

# 所有 LangChain 调用自动追踪
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5")
response = model.invoke([...])  # 自动发送到 LangSmith
```

### 7.2.2 手动追踪

```python
from langsmith import Client, traceable

client = Client()

@traceable(run_type="chain", name="MyChain")
def my_chain(input: str) -> str:
    # 自动记录输入输出
    return f"Processed: {input}"

@traceable(run_type="tool", name="MyTool")
def my_tool(query: str) -> str:
    # 记录工具调用
    return f"Result for: {query}"

# 手动记录
with client.create_run("my_experiment", run_type="chain") as run:
    result = my_chain("test")
    client.update_run(run.id, outputs={"result": result})
```

### 7.2.3 评估

```python
from langsmith import evaluate
from langsmith.schemas import Example, Run

# 定义评估器
def accuracy(run: Run, example: Example) -> dict:
    predicted = run.outputs.get("output", "")
    expected = example.outputs.get("expected", "")
    return {"score": 1.0 if predicted == expected else 0.0}

# 运行评估
results = evaluate(
    my_chain,
    data="my-dataset",  # LangSmith 中的数据集
    evaluators=[accuracy],
    experiment_prefix="v1-test",
)
```

---

## 7.3 Deep Agents SDK

### 7.3.1 快速开始

```python
from deepagents import create_deep_agent
from langchain_core.tools import tool

@tool
def search_web(query: str) -> str:
    """搜索网络"""
    return f"搜索结果：{query}"

# 创建 Deep Agent
agent = create_deep_agent(
    tools=[search_web],
    system_prompt="你是研究助手",
)

# 运行
result = agent.invoke({
    "messages": [{"role": "user", "content": "查询 LangChain 最新新闻"}]
})
```

### 7.3.2 文件系统

```python
from deepagents import create_deep_agent
from deepagents.backends import LocalBackend

# 使用本地文件系统
backend = LocalBackend(root_dir="./workspace")

agent = create_deep_agent(
    tools=[],
    system_prompt="你可以使用文件系统工具",
    backend=backend,
)

# Agent 可以使用：ls, read_file, write_file, edit_file
result = agent.invoke({
    "messages": [{"role": "user", "content": "列出当前目录文件"}]
})
```

### 7.3.3 子代理

```python
from deepagents import create_deep_agent

# Deep Agent 内置子代理功能
agent = create_deep_agent(
    tools=[],
    system_prompt="你是项目经理，可以分配任务给子代理",
)

# Agent 可以 spawn 子代理处理子任务
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "创建一个网站，包括前端和后端"
    }]
})
# Agent 会自动分解任务并分配给子代理
```

### 7.3.4 长期记忆

```python
from deepagents import create_deep_agent
from langgraph.store.memory import InMemoryStore

# 创建记忆存储
store = InMemoryStore()

agent = create_deep_agent(
    tools=[],
    system_prompt="记住用户的偏好",
    store=store,
)

# 跨会话记忆
config = {"configurable": {"user_id": "user-123"}}

agent.invoke({
    "messages": [{"role": "user", "content": "我喜欢 Python"}]
}, config)

# 下次会话会记住
agent.invoke({
    "messages": [{"role": "user", "content": "我喜欢的编程语言是什么？"}]
}, config)
```

---

## 7.4 整合实战

### 完整系统示例

```python
# complete_system.py
from langgraph.graph import StateGraph, START, END
from deepagents import create_deep_agent
from langsmith import traceable
import os

os.environ["LANGSMITH_TRACING"] = "true"

class SystemState(TypedDict):
    user_input: str
    analysis: dict
    result: str
    errors: List[str]

class CompleteSystem:
    def __init__(self):
        # Deep Agent 用于复杂任务
        self.planning_agent = create_deep_agent(
            tools=[],
            system_prompt="你是规划专家，分解复杂任务",
        )
        
        # LangGraph 工作流
        graph = StateGraph(SystemState)
        graph.add_node("analyze", self.analyze_input)
        graph.add_node("plan", self.create_plan)
        graph.add_node("execute", self.execute_plan)
        graph.add_node("review", self.review_result)
        
        graph.add_edge(START, "analyze")
        graph.add_edge("analyze", "plan")
        graph.add_edge("plan", "execute")
        graph.add_edge("execute", "review")
        graph.add_edge("review", END)
        
        self.workflow = graph.compile()
    
    @traceable
    def analyze_input(self, state: SystemState) -> dict:
        """分析输入"""
        # 实现
        pass
    
    @traceable
    def create_plan(self, state: SystemState) -> dict:
        """创建计划"""
        result = self.planning_agent.invoke({
            "messages": [{"role": "user", "content": state["user_input"]}]
        })
        return {"analysis": result}
    
    @traceable
    def execute_plan(self, state: SystemState) -> dict:
        """执行计划"""
        # 实现
        pass
    
    @traceable
    def review_result(self, state: SystemState) -> dict:
        """审查结果"""
        # 实现
        return {"result": "最终结果"}
    
    async def run(self, user_input: str) -> str:
        result = await self.workflow.ainvoke({
            "user_input": user_input,
            "analysis": {},
            "result": "",
            "errors": [],
        })
        return result["result"]
```

---

## ✅ 本章检查清单

- [ ] 掌握 LangGraph 状态图
- [ ] 学会使用 LangSmith 追踪
- [ ] 理解 Deep Agents 能力
- [ ] 能够整合三个工具

---

**上一章**: [第六章：生产实战](../06-production-scenarios/README.md)  
**下一章**: [第八章：工程化进阶](../08-engineering/README.md)
