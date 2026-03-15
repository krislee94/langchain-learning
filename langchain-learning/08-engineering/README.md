# 第八章：工程化进阶 - 性能调优与线上最佳实践

> 从能用到好用：生产环境的性能优化

---

## 📌 本章学习目标

- 掌握性能分析和优化方法
- 学会缓存和并发控制
- 理解成本优化策略
- 建立线上运维最佳实践

---

## 8.1 性能分析

### 8.1.1 基准测试

```python
import time
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"{name}: {elapsed:.2f}s")

# 测试单次调用
with timer("LLM 调用"):
    response = model.invoke(messages)

# 批量测试
import statistics

latencies = []
for i in range(100):
    start = time.time()
    model.invoke(messages)
    latencies.append(time.time() - start)

print(f"P50: {statistics.median(latencies):.2f}s")
print(f"P95: {sorted(latencies)[95]:.2f}s")
print(f"P99: {sorted(latencies)[99]:.2f}s")
```

### 8.1.2 性能瓶颈分析

```python
from langchain.callbacks import tracing_enabled
from langsmith import Client

client = Client()

# 分析 trace 找出瓶颈
runs = client.list_runs(project_name="my-project", limit=100)

latency_by_type = {}
for run in runs:
    run_type = run.run_type
    latency = (run.end_time - run.start_time).total_seconds()
    latency_by_type.setdefault(run_type, []).append(latency)

for run_type, latencies in latency_by_type.items():
    print(f"{run_type}: avg={statistics.mean(latencies):.2f}s")
```

---

## 8.2 缓存策略

### 8.2.1 内存缓存

```python
from functools import lru_cache
from langchain_core.language_models import BaseChatModel

class CachedChatModel(BaseChatModel):
    def __init__(self, model: BaseChatModel, cache_size: int = 1000):
        self.model = model
        self._cached_invoke = lru_cache(maxsize=cache_size)(
            self._invoke_uncached
        )
    
    def _invoke_uncached(self, messages_key: str) -> dict:
        """实际调用（不带缓存）"""
        return self.model.invoke(messages_key)
    
    def invoke(self, messages: List) -> dict:
        # 创建缓存键
        messages_key = str(messages)
        return self._cached_invoke(messages_key)

# 使用
cached_model = CachedChatModel(original_model)
```

### 8.2.2 Redis 缓存

```python
import redis
import hashlib
import json

class RedisCache:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
        self.ttl = 3600  # 1 小时
    
    def _make_key(self, messages: List) -> str:
        content = str(messages)
        return f"cache:{hashlib.md5(content.encode()).hexdigest()}"
    
    def get(self, messages: List) -> Optional[dict]:
        key = self._make_key(messages)
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def set(self, messages: List, response: dict):
        key = self._make_key(messages)
        self.redis.setex(key, self.ttl, json.dumps(response))

# 使用
cache = RedisCache("redis://localhost")

def cached_invoke(messages: List) -> dict:
    # 尝试缓存
    cached = cache.get(messages)
    if cached:
        return cached
    
    # 调用模型
    response = model.invoke(messages)
    
    # 保存缓存
    cache.set(messages, response)
    return response
```

### 8.2.3 语义缓存

```python
from langchain.cache import SQLiteCache, SemanticCache
from langchain.embeddings import OpenAIEmbeddings

# SQLite 缓存（精确匹配）
SQLiteCache(database_path=".langchain.db")

# 语义缓存（相似查询）
embeddings = OpenAIEmbeddings()
SemanticCache(
    embeddings=embeddings,
    similarity_threshold=0.95,  # 相似度阈值
)
```

---

## 8.3 并发控制

### 8.3.1 异步调用

```python
import asyncio
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-5")

async def process_batch(inputs: List[str]) -> List[str]:
    # 并发执行
    tasks = [
        model.ainvoke([{"role": "user", "content": text}])
        for text in inputs
    ]
    results = await asyncio.gather(*tasks)
    return [r.content for r in results]

# 使用
results = asyncio.run(process_batch(["问题 1", "问题 2", "问题 3"]))
```

### 8.3.2 限流

```python
import asyncio
from asyncio import Semaphore

class RateLimitedAgent:
    def __init__(self, agent, max_concurrent: int = 5):
        self.agent = agent
        self.semaphore = Semaphore(max_concurrent)
    
    async def invoke(self, messages: List) -> dict:
        async with self.semaphore:
            return await self.agent.ainvoke({"messages": messages})

# 使用
limited_agent = RateLimitedAgent(agent, max_concurrent=3)

# 并发但有上限
tasks = [limited_agent.invoke(msg) for msg in messages_list]
results = await asyncio.gather(*tasks)
```

### 8.3.3 批处理

```python
from langchain_core.language_models import BaseChatModel

class BatchProcessor:
    def __init__(self, model: BaseChatModel, batch_size: int = 10):
        self.model = model
        self.batch_size = batch_size
    
    async def process(self, inputs: List[str]) -> List[str]:
        results = []
        
        # 分批处理
        for i in range(0, len(inputs), self.batch_size):
            batch = inputs[i:i + self.batch_size]
            
            # 并发处理批次
            tasks = [
                self.model.ainvoke([{"role": "user", "content": text}])
                for text in batch
            ]
            batch_results = await asyncio.gather(*tasks)
            results.extend([r.content for r in batch_results])
            
            # 避免速率限制
            await asyncio.sleep(0.1)
        
        return results
```

---

## 8.4 成本优化

### 8.4.1 Token 优化

```python
def optimize_prompt(prompt: str) -> str:
    """优化提示词减少 token"""
    # 移除冗余词汇
    redundant = ["请", "麻烦", "能否", "谢谢"]
    for word in redundant:
        prompt = prompt.replace(word, "")
    
    # 简化指令
    prompt = prompt.replace("请你帮我分析一下", "分析")
    prompt = prompt.replace "请用简洁的语言回答", "简要回答")
    
    return prompt

# 使用
optimized = optimize_prompt(original_prompt)
```

### 8.4.2 模型路由

```python
class ModelRouter:
    def __init__(self):
        self.simple_model = ChatOpenAI(model="gpt-3.5-turbo")  # 便宜
        self.complex_model = ChatAnthropic(model="claude-sonnet-4-5")  # 贵
    
    def route(self, query: str) -> BaseChatModel:
        """根据复杂度路由到不同模型"""
        if len(query) < 50 and "?" not in query:
            return self.simple_model
        else:
            return self.complex_model
    
    async def invoke(self, messages: List) -> dict:
        model = self.route(messages[0].content)
        return await model.ainvoke(messages)
```

### 8.4.3 使用追踪分析成本

```python
from langsmith import Client

client = Client()

def analyze_costs(project_name: str, days: int = 7):
    runs = client.list_runs(
        project_name=project_name,
        start_time=datetime.now() - timedelta(days=days),
    )
    
    total_tokens = 0
    cost_by_model = {}
    
    for run in runs:
        usage = run.outputs.get("usage_metadata", {})
        tokens = usage.get("total_tokens", 0)
        total_tokens += tokens
        
        model = run.extra.get("metadata", {}).get("model_name", "unknown")
        cost_by_model[model] = cost_by_model.get(model, 0) + tokens
    
    print(f"总 Token: {total_tokens:,}")
    print(f"按模型分布:")
    for model, tokens in cost_by_model.items():
        print(f"  {model}: {tokens:,} ({tokens/total_tokens*100:.1f}%)")

analyze_costs("my-project")
```

---

## 8.5 监控和告警

### 8.5.1 健康检查

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    try:
        # 测试模型调用
        model.invoke([{"role": "user", "content": "ping"}])
        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/metrics")
async def metrics():
    return {
        "requests_total": REQUEST_COUNT._value.get(),
        "avg_latency": REQUEST_LATENCY._sum.get() / max(1, REQUEST_COUNT._value.get()),
        "active_sessions": ACTIVE_SESSIONS._value.get(),
    }
```

### 8.5.2 告警规则

```python
# prometheus_alerts.yml
groups:
  - name: langchain
    rules:
      - alert: HighLatency
        expr: ai_request_latency > 5
        for: 5m
        annotations:
          summary: "高延迟告警"
      
      - alert: HighErrorRate
        expr: rate(ai_errors_total[5m]) > 0.1
        annotations:
          summary: "高错误率告警"
      
      - alert: TokenLimit
        expr: ai_tokens_total > 1000000
        annotations:
          summary: "Token 使用接近上限"
```

---

## ✅ 本章检查清单

- [ ] 掌握性能分析方法
- [ ] 实现缓存策略
- [ ] 学会并发控制
- [ ] 优化成本
- [ ] 建立监控体系

---

**上一章**: [第七章：LangGraph + Deep Agents](../07-langgraph-deepagents/README.md)  
**下一章**: [第九章：避坑指南](../09-troubleshooting/README.md)
