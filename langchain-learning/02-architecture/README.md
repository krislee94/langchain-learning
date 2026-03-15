# 第二章：LangChain 底层架构与运行原理深度解析

> 深入理解 LangChain 的内部工作机制

---

## 📌 本章学习目标

- 理解 LangChain 的分层架构设计
- 掌握核心抽象层（langchain-core）的作用
- 了解消息传递和状态管理机制
- 理解 Agent 执行流程和工具调用原理

---

## 2.1 LangChain 分层架构

### 2.1.1 三层架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Applications)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Deep Agents │  │LangChain    │  │ 自定义应用   │          │
│  │  (Harness)  │  │ Agents      │  │             │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    编排层 (Orchestration)                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   LangGraph                          │    │
│  │  • 状态图 (StateGraph)  • 节点 (Nodes)              │    │
│  │  • 边 (Edges)         • 条件分支 (Conditional)      │    │
│  │  • 持久化 (Persistence) • 人工介入 (Human-in-loop)  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    核心层 (Core) - langchain-core            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Messages │ │ Prompts  │ │  Models  │ │  Tools   │       │
│  │  Memory  │ │ Retrievers│ │ Chains  │ │ Callbacks│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│                    集成层 (Integrations)                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │OpenAI  │ │Anthropic│ │Google  │ │ 更多... │ │ 向量库  │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.1.2 各层职责

| 层级 | 包名 | 职责 | 稳定性 |
|------|------|------|--------|
| **应用层** | `deepagents`, `langchain` | 开箱即用的应用模板 | 快速迭代 |
| **编排层** | `langgraph` | 工作流编排和状态管理 | 稳定 |
| **核心层** | `langchain-core` | 统一抽象和接口定义 | 非常稳定 |
| **集成层** | `langchain-xxx` | 第三方服务集成 | 独立版本 |

---

## 2.2 langchain-core 核心抽象

### 2.2.1 为什么需要核心层

```python
# 没有 langchain-core 之前：
# 每个集成包都定义自己的消息类
from langchain_openai import OpenAIMessage
from langchain_anthropic import AnthropicMessage
# 无法互换使用！

# 有了 langchain-core：
from langchain_core.messages import HumanMessage, AIMessage
# 所有集成包使用相同的消息类型！
```

### 2.2.2 核心抽象类型

```python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langchain_core.retrievers import BaseRetriever
from langchain_core.memory import BaseMemory
from langchain_core.callbacks import BaseCallbackHandler
```

### 2.2.3 消息类型详解

```python
from langchain_core.messages import (
    HumanMessage,      # 用户消息
    AIMessage,         # AI 回复
    SystemMessage,     # 系统指令
    ToolMessage,       # 工具执行结果
    FunctionMessage,   # 函数调用（旧版）
    ChatMessage,       # 通用消息
)

# 创建消息
messages = [
    SystemMessage(content="你是一个有帮助的助手"),
    HumanMessage(content="你好"),
    AIMessage(content="你好！有什么可以帮助你的？"),
    HumanMessage(content="北京天气怎么样？"),
]

# 消息属性
msg = HumanMessage(content="测试", additional_kwargs={"custom": "data"})
print(msg.content)           # "测试"
print(msg.additional_kwargs) # {"custom": "data"}
```

---

## 2.3 模型调用流程

### 2.3.1 标准调用链路

```
用户输入
   │
   ▼
┌─────────────────┐
│  ChatPromptTemplate │ ← 提示词模板
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Format Messages   │ ← 格式化为模型输入
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  BaseChatModel    │ ← 模型抽象层
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Provider API     │ ← 实际 API 调用
│  (OpenAI/Anthropic)│
└─────────────────┘
   │
   ▼
┌─────────────────┐
│  Parse Response   │ ← 解析响应
└─────────────────┘
   │
   ▼
AIMessage 输出
```

### 2.3.2 代码实现

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

# 1. 定义提示词模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是{role}，擅长{skill}"),
    ("human", "{question}"),
])

# 2. 实例化模型
model = ChatAnthropic(model="claude-sonnet-4-5")

# 3. 创建链（Prompt + Model）
chain = prompt | model

# 4. 调用
response = chain.invoke({
    "role": "数学老师",
    "skill": "解释复杂概念",
    "question": "什么是微积分？"
})

print(response.content)
```

---

## 2.4 Agent 执行原理

### 2.4.1 Agent 核心循环

```
┌──────────────────────────────────────────────────────────┐
│                    Agent 执行循环                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. 接收用户输入                                          │
│     ↓                                                    │
│  2. LLM 分析是否需要调用工具                               │
│     ↓                                                    │
│  3a. 需要工具 → 调用工具 → 获取结果 → 回到步骤 2            │
│     ↓                                                    │
│  3b. 不需要工具 → 生成最终回复                             │
│     ↓                                                    │
│  4. 返回结果给用户                                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 2.4.2 工具调用机制

```python
from langchain_core.tools import tool

# 定义工具（使用装饰器）
@tool
def search(query: str) -> str:
    """搜索信息"""
    return f"搜索结果：{query}"

# 工具的本质
print(search.name)        # "search"
print(search.description) # "搜索信息"
print(search.args_schema) # Pydantic 模型

# 工具调用
result = search.invoke({"query": "LangChain"})
```

### 2.4.3 工具装饰器原理

```python
# 装饰器做了什么？
def search(query: str) -> str:
    """搜索信息"""
    return f"搜索结果：{query}"

# 等价于：
from langchain_core.tools import StructuredTool
from pydantic import BaseModel

class SearchArgs(BaseModel):
    query: str

search_tool = StructuredTool(
    name="search",
    description="搜索信息",
    args_schema=SearchArgs,
    func=search,
)
```

---

## 2.5 LangGraph 状态管理

### 2.5.1 StateGraph 基础

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List

# 1. 定义状态
class AgentState(TypedDict):
    messages: List
    current_step: str
    data: dict

# 2. 创建图
graph = StateGraph(AgentState)

# 3. 定义节点
def node_a(state: AgentState):
    return {"current_step": "A", "data": {"processed": True}}

def node_b(state: AgentState):
    return {"current_step": "B"}

# 4. 添加节点
graph.add_node("process_a", node_a)
graph.add_node("process_b", node_b)

# 5. 添加边
graph.add_edge(START, "process_a")
graph.add_edge("process_a", "process_b")
graph.add_edge("process_b", END)

# 6. 编译
app = graph.compile()

# 7. 执行
result = app.invoke({
    "messages": [],
    "current_step": "start",
    "data": {}
})
```

### 2.5.2 条件分支

```python
from langgraph.graph import StateGraph
from typing import Literal

def router(state: AgentState) -> Literal["path_a", "path_b"]:
    """根据状态决定走哪条路"""
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
```

---

## 2.6 持久化机制

### 2.6.1 检查点（Checkpoints）

```python
from langgraph.checkpoint.memory import MemorySaver

# 创建内存检查点
memory = MemorySaver()

# 编译时传入
app = graph.compile(checkpointer=memory)

# 使用线程 ID 实现会话隔离
config = {"configurable": {"thread_id": "user-123"}}

# 第一次调用
app.invoke({"messages": ["你好"]}, config)

# 后续调用会记住之前的状态
app.invoke({"messages": ["继续之前的话题"]}, config)
```

### 2.6.2 持久化选项

| 类型 | 类名 | 适用场景 |
|------|------|----------|
| 内存检查点 | `MemorySaver` | 开发测试 |
| SQLite 检查点 | `SqliteSaver` | 本地持久化 |
| Postgres 检查点 | `PostgresSaver` | 生产环境 |
| Redis 检查点 | `RedisSaver` | 分布式场景 |

---

## 2.7 回调系统

### 2.7.1 回调用途

```python
from langchain_core.callbacks import BaseCallbackHandler

class MyCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"LLM 开始：{prompts[0][:50]}...")
    
    def on_llm_end(self, response, **kwargs):
        print(f"LLM 结束：{response.generations[0][0].text[:50]}...")
    
    def on_tool_start(self, serialized, input, **kwargs):
        print(f"工具调用：{serialized['name']}")
    
    def on_tool_end(self, output, **kwargs):
        print(f"工具结果：{output}")

# 使用回调
model = ChatAnthropic(
    model="claude-sonnet-4-5",
    callbacks=[MyCallback()],
)
```

### 2.7.2 LangSmith 集成

```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-api-key"

# 自动追踪所有调用
from langchain_anthropic import ChatAnthropic
model = ChatAnthropic(model="claude-sonnet-4-5")
# 所有调用会自动发送到 LangSmith
```

---

## 🧪 动手实验

### 实验 2-1：理解消息传递

在 `demos/01-message-flow.py` 中探索消息如何在系统中传递。

### 实验 2-2：自定义工具

在 `demos/02-custom-tool.py` 中创建并使用自定义工具。

### 实验 2-3：状态图基础

在 `demos/03-stategraph-basics.py` 中创建简单的状态图。

---

## 📚 延伸阅读

- [langchain-core API 参考](https://python.langchain.com/docs/core/)
- [LangGraph 概念文档](https://docs.langchain.com/oss/python/langgraph/concepts)
- [LangChain 回调系统](https://docs.langchain.com/oss/python/langchain/callbacks)

---

## ✅ 本章检查清单

- [ ] 理解三层架构设计
- [ ] 掌握 langchain-core 核心抽象
- [ ] 理解消息传递流程
- [ ] 掌握 Agent 执行循环
- [ ] 了解 LangGraph 状态管理
- [ ] 完成 3 个动手实验

---

**上一章**: [第一章：核心价值与行业地位](../01-core-value/README.md)  
**下一章**: [第三章：5 分钟搭建第一个 AI 应用](../03-quickstart/README.md)
