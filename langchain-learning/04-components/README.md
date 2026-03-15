# 第四章：六大核心组件实战 - 从原理到代码落地

> 深入掌握 LangChain 的核心构建块

---

## 📌 本章学习目标

- 掌握六大核心组件的使用方法
- 理解每个组件的应用场景
- 能够组合组件构建复杂应用
- 学会自定义和扩展组件

---

## 4.1 组件总览

```
┌─────────────────────────────────────────────────────────────┐
│                    LangChain 六大核心组件                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Models (模型)      → LLM 接口抽象                        │
│  2. Prompts (提示词)   → 模板和管理                          │
│  3. Chains (链)        → 组件组合                            │
│  4. Agents (智能体)    → 自主决策                            │
│  5. Memory (记忆)      → 状态持久化                          │
│  6. Retrievers (检索)  → 知识检索                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4.2 Models - 模型层

### 4.2.1 模型类型

```python
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

# Chat Model（对话模型）
chat_model = ChatAnthropic(model="claude-sonnet-4-5")

# 调用方式
from langchain_core.messages import HumanMessage

# 方式 1: invoke（同步）
response = chat_model.invoke([HumanMessage("你好")])

# 方式 2: stream（流式）
for chunk in chat_model.stream([HumanMessage("讲故事")]):
    print(chunk.content, end="", flush=True)

# 方式 3: batch（批量）
responses = chat_model.batch([
    [HumanMessage("你好")],
    [HumanMessage("再见")],
])
```

### 4.2.2 模型配置

```python
model = ChatAnthropic(
    model="claude-sonnet-4-5",
    temperature=0.7,        # 创造性 (0-1)
    max_tokens=1024,        # 最大输出长度
    timeout=60,             # 超时时间
    max_retries=3,          # 重试次数
    api_key="sk-...",       # 或从环境变量读取
)
```

---

## 4.3 Prompts - 提示词工程

### 4.3.1 提示词模板

```python
from langchain_core.prompts import ChatPromptTemplate

# 基础模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是{role}"),
    ("human", "{question}"),
])

# 格式化
formatted = prompt.invoke({
    "role": "翻译官",
    "question": 'Hello'
})
# 输出：[SystemMessage("你是翻译官"), HumanMessage("Hello")]
```

### 4.3.2 少样本提示（Few-Shot）

```python
from langchain_core.prompts import FewShotChatMessagePromptTemplate

# 示例
examples = [
    {"input": "2+2", "output": "4"},
    {"input": "3*5", "output": "15"},
    {"input": "10/2", "output": "5"},
]

# 创建示例提示
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
    ("ai", "{output}"),
])

few_shot = FewShotChatMessagePromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    input_variables=["input"],
)

# 使用
final_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是数学助手"),
    few_shot,
    ("human", "{input}"),
])
```

### 4.3.3 提示词优化技巧

```python
# 1. 明确角色
system_prompt = """你是资深软件工程师，擅长 Python 开发。
请用专业但易懂的方式回答问题。"""

# 2. 提供上下文
context_prompt = """基于以下信息回答：
{context}

问题：{question}"""

# 3. 指定输出格式
format_prompt = """请用 JSON 格式回答：
{
  "answer": "...",
  "confidence": 0.0-1.0
}"""

# 4. 思维链（Chain of Thought）
cot_prompt = """请逐步思考：
1. 理解问题
2. 分析已知条件
3. 制定解决方案
4. 给出答案"""
```

---

## 4.4 Chains - 链式调用

### 4.4.1 基础链

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

# 创建组件
prompt = ChatPromptTemplate.from_template("讲一个关于{topic}的笑话")
model = ChatAnthropic(model="claude-sonnet-4-5")

# 组合成链
chain = prompt | model

# 调用
result = chain.invoke({"topic": "程序员"})
print(result.content)
```

### 4.4.2 链式组合

```python
from langchain_core.output_parsers import StrOutputParser

# 多步骤处理
chain = (
    prompt
    | model
    | StrOutputParser()  # 解析输出
)

result = chain.invoke({"topic": "AI"})
# result 现在是字符串而不是 AIMessage
```

### 4.4.3 并行链

```python
from langchain_core.runnables import RunnableParallel

# 同时执行多个任务
parallel = RunnableParallel(
    summary=model | StrOutputParser(),
    translation=prompt | model | StrOutputParser(),
)

result = parallel.invoke({"topic": "科技"})
# {"summary": "...", "translation": "..."}
```

---

## 4.5 Agents - 智能体

### 4.5.1 创建 Agent

```python
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def search(query: str) -> str:
    """搜索信息"""
    return f"搜索结果：{query}"

@tool
def calculator(expr: str) -> str:
    """计算表达式"""
    return f"{expr} = {eval(expr)}"

agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[search, calculator],
    system_prompt="你是万能助手",
)
```

### 4.5.2 Agent 执行

```python
# 单次执行
result = agent.invoke({
    "messages": [{"role": "user", "content": "计算 123*456"}]
})

# 流式执行
for chunk in agent.stream({
    "messages": [{"role": "user", "content": "搜索 AI 新闻"}]
}):
    print(chunk)
```

---

## 4.6 Memory - 记忆系统

### 4.6.1 对话缓冲

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
)

# 添加对话
memory.save_context(
    {"input": "你好"},
    {"output": "你好！有什么可以帮助你的？"}
)

# 获取历史
history = memory.load_memory_variables({})
```

### 4.6.2 对话摘要

```python
from langchain.memory import ConversationSummaryMemory
from langchain_anthropic import ChatAnthropic

memory = ConversationSummaryMemory(
    llm=ChatAnthropic(model="claude-sonnet-4-5"),
    memory_key="summary",
)

# 长对话会自动摘要
```

### 4.6.3 向量记忆

```python
from langchain.memory import VectorStoreRetrieverMemory
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# 创建向量存储
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(
    ["第一次见面", "讨论项目", "约定会议"],
    embeddings
)

# 创建记忆
memory = VectorStoreRetrieverMemory(
    retriever=vectorstore.as_retriever()
)
```

---

## 4.7 Retrievers - 检索器

### 4.7.1 基础检索

```python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# 加载文档
loader = TextLoader("document.txt")
docs = loader.load()

# 分割
splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
chunks = splitter.split_documents(docs)

# 创建向量库
vectorstore = FAISS.from_documents(chunks, OpenAIEmbeddings())

# 创建检索器
retriever = vectorstore.as_retriever()

# 检索
results = retriever.invoke("相关问题")
```

### 4.7.2 检索策略

```python
# 相似度检索
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# MMR（最大边界相关）
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10}
)

# 相似度 + 阈值
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.7}
)
```

---

## 4.8 组件组合实战

### 4.8.1 RAG 系统

```python
from langchain_core.runnables import RunnablePassthrough

# RAG = 检索 + 生成
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

result = rag_chain.invoke("你的问题")
```

### 4.8.2 带记忆的对话系统

```python
from langchain.agents import create_agent
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
)

agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[],
    system_prompt="你是友好的聊天助手",
    memory=memory,
)
```

---

## 🧪 动手实验

每个组件都有对应的 demo 代码在 `demos/` 目录中。

---

## ✅ 本章检查清单

- [ ] 理解六大组件各自的作用
- [ ] 能够创建和使用每种组件
- [ ] 掌握组件组合的方法
- [ ] 完成所有动手实验

---

**上一章**: [第三章：快速上手](../03-quickstart/README.md)  
**下一章**: [第五章：企业级设计模式](../05-design-patterns/README.md)
