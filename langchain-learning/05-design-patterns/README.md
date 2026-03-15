# 第五章：架构师思维 - 企业级 AI 应用设计模式

> 从代码到架构：构建可扩展、可维护的 AI 系统

---

## 📌 本章学习目标

- 掌握企业级 AI 应用的常见设计模式
- 理解如何设计可扩展的系统架构
- 学会处理复杂业务场景
- 建立架构师思维模式

---

## 5.1 分层架构模式

### 5.1.1 经典三层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    表示层 (Presentation)                      │
│  • API 接口  • Web UI  • 移动端  • WebSocket                 │
├─────────────────────────────────────────────────────────────┤
│                    业务层 (Business Logic)                    │
│  • Agent 编排  • 工具管理  • 流程控制  • 规则引擎             │
├─────────────────────────────────────────────────────────────┤
│                    数据层 (Data)                              │
│  • 向量数据库  • 关系数据库  • 缓存  • 文件系统               │
└─────────────────────────────────────────────────────────────┘
```

### 5.1.2 代码实现

```python
# layers.py

# ========== 数据层 ==========
class DataLayer:
    def __init__(self):
        self.vector_store = FAISS(...)
        self.db = PostgreSQL(...)
        self.cache = Redis(...)
    
    def retrieve_documents(self, query: str) -> List[Document]:
        return self.vector_store.similarity_search(query)
    
    def save_conversation(self, user_id: str, messages: List):
        self.db.insert("conversations", {"user_id": user_id, "messages": messages})

# ========== 业务层 ==========
class BusinessLayer:
    def __init__(self, data_layer: DataLayer):
        self.data = data_layer
        self.agent = create_agent(...)
    
    async def process_request(self, user_id: str, query: str) -> str:
        # 检索上下文
        context = self.data.retrieve_documents(query)
        
        # 调用 Agent
        response = await self.agent.ainvoke({
            "messages": [{"role": "user", "content": f"基于{context}回答：{query}"}]
        })
        
        # 保存历史
        self.data.save_conversation(user_id, response["messages"])
        
        return response["messages"][-1].content

# ========== 表示层 ==========
class PresentationLayer:
    def __init__(self, business_layer: BusinessLayer):
        self.business = business_layer
    
    @app.post("/chat")
    async def chat_endpoint(request: ChatRequest):
        response = await self.business.process_request(
            request.user_id,
            request.message
        )
        return {"reply": response}
```

---

## 5.2 Agent 编排模式

### 5.2.1 主从 Agent 模式

```python
from langgraph.graph import StateGraph, START, END

class MasterSlaveArchitecture:
    """
    主 Agent 协调多个专业从 Agent
    """
    
    def __init__(self):
        # 主 Agent - 路由和协调
        self.master_agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[self.route_to_specialist],
            system_prompt="你是协调员，根据问题类型分配给专家",
        )
        
        # 从 Agent - 专业领域
        self.specialists = {
            "coding": create_agent(model="...", tools=[...], system_prompt="你是编程专家"),
            "writing": create_agent(model="...", tools=[...], system_prompt="你是写作专家"),
            "analysis": create_agent(model="...", tools=[...], system_prompt="你是数据分析专家"),
        }
    
    def route_to_specialist(self, domain: str, query: str) -> str:
        """路由到专业 Agent"""
        if domain in self.specialists:
            result = self.specialists[domain].invoke({"messages": [{"role": "user", "content": query}]})
            return result["messages"][-1].content
        return "未知领域"
```

### 5.2.2 流水线模式

```python
class PipelineArchitecture:
    """
    多阶段处理流水线
    """
    
    def __init__(self):
        self.stages = [
            self.stage_understand,    # 理解意图
            self.stage_plan,          # 制定计划
            self.stage_execute,       # 执行任务
            self.stage_review,        # 审查结果
            self.stage_respond,       # 生成回复
        ]
    
    async def process(self, user_input: str) -> str:
        state = {"input": user_input, "history": []}
        
        for stage in self.stages:
            state = await stage(state)
            state["history"].append({
                "stage": stage.__name__,
                "output": state.get("last_output")
            })
        
        return state["response"]
    
    async def stage_understand(self, state: dict) -> dict:
        """理解用户意图"""
        # ... 实现
        pass
    
    async def stage_plan(self, state: dict) -> dict:
        """制定解决计划"""
        # ... 实现
        pass
```

### 5.2.3 投票模式

```python
class VotingArchitecture:
    """
    多个 Agent 并行执行，投票决定最佳结果
    """
    
    def __init__(self):
        self.agents = [
            create_agent(model="claude-sonnet-4-5", ...),
            create_agent(model="gpt-4o", ...),
            create_agent(model="gemini-2-pro", ...),
        ]
        self.judge = create_agent(model="claude-sonnet-4-5", ...)
    
    async def process(self, query: str) -> str:
        # 并行执行
        tasks = [
            agent.ainvoke({"messages": [{"role": "user", "content": query}]})
            for agent in self.agents
        ]
        results = await asyncio.gather(*tasks)
        
        # 投票选择最佳
        judge_input = "\n\n".join([
            f"答案{i+1}: {r['messages'][-1].content}"
            for i, r in enumerate(results)
        ])
        
        judge_result = await self.judge.ainvoke({
            "messages": [{
                "role": "user",
                "content": f"从以下答案中选择最佳的：\n{judge_input}"
            }]
        })
        
        return judge_result["messages"][-1].content
```

---

## 5.3 状态管理模式

### 5.3.1 集中式状态

```python
from typing import TypedDict, List, Optional
from datetime import datetime

class ConversationState(TypedDict):
    """统一的会话状态"""
    user_id: str
    session_id: str
    messages: List[dict]
    context: dict
    metadata: {
        "created_at": datetime,
        "updated_at": datetime,
        "token_count": int,
    }

class StateManager:
    def __init__(self):
        self.states: Dict[str, ConversationState] = {}
    
    def create_state(self, user_id: str) -> str:
        session_id = str(uuid.uuid4())
        self.states[session_id] = {
            "user_id": user_id,
            "session_id": session_id,
            "messages": [],
            "context": {},
            "metadata": {
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "token_count": 0,
            }
        }
        return session_id
    
    def update_state(self, session_id: str, **kwargs):
        state = self.states[session_id]
        state.update(kwargs)
        state["metadata"]["updated_at"] = datetime.now()
```

### 5.3.2 分布式状态（Redis）

```python
import redis
import json

class RedisStateManager:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
    
    def save_state(self, session_id: str, state: dict, ttl: int = 3600):
        """保存状态，TTL 默认 1 小时"""
        self.redis.setex(
            f"session:{session_id}",
            ttl,
            json.dumps(state, default=str)
        )
    
    def load_state(self, session_id: str) -> Optional[dict]:
        """加载状态"""
        data = self.redis.get(f"session:{session_id}")
        return json.loads(data) if data else None
```

---

## 5.4 错误处理模式

### 5.4.1 重试模式

```python
from tenacity import retry, stop_after_attempt, wait_exponential

class ResilientAgent:
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def invoke_with_retry(self, messages: List) -> dict:
        """带重试的 Agent 调用"""
        return await self.agent.ainvoke({"messages": messages})
    
    async def safe_invoke(self, messages: List) -> dict:
        """安全调用，带降级"""
        try:
            return await self.invoke_with_retry(messages)
        except Exception as e:
            # 降级：返回预设回复
            return {
                "messages": [{
                    "role": "assistant",
                    "content": f"抱歉，服务暂时不可用：{str(e)}"
                }]
            }
```

### 5.4.2 熔断模式

```python
from circuitbreaker import circuit

class CircuitBreakerAgent:
    @circuit(failure_threshold=5, recovery_timeout=60)
    async def invoke(self, messages: List) -> dict:
        return await self.agent.ainvoke({"messages": messages})
    
    async def process(self, query: str) -> str:
        try:
            result = await self.invoke({"messages": [{"role": "user", "content": query}]})
            return result["messages"][-1].content
        except CircuitBreakerOpen:
            return "服务繁忙，请稍后再试"
```

---

## 5.5 监控和观测模式

### 5.5.1 指标收集

```python
from prometheus_client import Counter, Histogram, Gauge

# 定义指标
REQUEST_COUNT = Counter('ai_requests_total', 'Total requests')
REQUEST_LATENCY = Histogram('ai_request_latency', 'Request latency')
TOKEN_COUNT = Counter('ai_tokens_total', 'Total tokens')
ACTIVE_SESSIONS = Gauge('ai_active_sessions', 'Active sessions')

class MonitoredAgent:
    async def process(self, user_id: str, query: str) -> str:
        start_time = time.time()
        REQUEST_COUNT.inc()
        ACTIVE_SESSIONS.inc()
        
        try:
            result = await self.agent.ainvoke({"messages": [...]})
            
            # 记录 token 使用
            usage = result.get("usage_metadata", {})
            TOKEN_COUNT.inc(usage.get("total_tokens", 0))
            
            return result["messages"][-1].content
            
        finally:
            latency = time.time() - start_time
            REQUEST_LATENCY.observe(latency)
            ACTIVE_SESSIONS.dec()
```

### 5.5.2 分布式追踪

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

class TracedAgent:
    @tracer.start_as_current_span("agent_process")
    async def process(self, query: str) -> str:
        span = trace.get_current_span()
        span.set_attribute("query.length", len(query))
        
        with tracer.start_as_current_span("llm_call"):
            result = await self.agent.ainvoke(...)
        
        with tracer.start_as_current_span("post_process"):
            response = self.post_process(result)
        
        return response
```

---

## ✅ 本章检查清单

- [ ] 理解分层架构
- [ ] 掌握 Agent 编排模式
- [ ] 学会状态管理
- [ ] 实现错误处理和降级
- [ ] 建立监控体系

---

**上一章**: [第四章：核心组件](../04-components/README.md)  
**下一章**: [第六章：生产级实战](../06-production-scenarios/README.md)
