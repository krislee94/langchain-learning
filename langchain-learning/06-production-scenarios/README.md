# 第六章：生产级实战 - 5 大真实业务场景落地

> 从 Demo 到生产：真实业务场景的完整实现

---

## 📌 本章学习目标

- 掌握 5 个典型生产场景的实现
- 理解生产环境的关键考量
- 学会处理边界情况和异常
- 建立生产化思维

---

## 场景 1：智能客服系统

### 需求分析
- 7x24 小时自动应答
- 多轮对话能力
- 知识库检索
- 人工接管

### 完整实现

```python
# customer_service.py
from langchain.agents import create_agent
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import FAISS
from langchain_core.tools import tool

class CustomerServiceBot:
    def __init__(self):
        # 知识库
        self.knowledge_base = self.load_knowledge_base()
        
        # 记忆
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            max_token_limit=2000,
        )
        
        # 工具
        @tool
        def search_knowledge(query: str) -> str:
            """从知识库搜索答案"""
            results = self.knowledge_base.similarity_search(query, k=3)
            return "\n\n".join([doc.page_content for doc in results])
        
        @tool
        def escalate_to_human(issue: str) -> str:
            """转接人工客服"""
            # 发送到工单系统
            ticket_id = create_ticket(issue)
            return f"已创建工单 {ticket_id}，客服将尽快联系您"
        
        # Agent
        self.agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[search_knowledge, escalate_to_human],
            system_prompt="""你是客服助手，请：
1. 优先从知识库查找答案
2. 无法解决时转接人工
3. 保持友好专业""",
            memory=self.memory,
        )
    
    async def chat(self, user_id: str, message: str) -> str:
        result = await self.agent.ainvoke({
            "messages": [{"role": "user", "content": message}]
        })
        return result["messages"][-1].content
```

---

## 场景 2：文档问答系统（RAG）

### 完整实现

```python
# rag_qa.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

class DocumentQA:
    def __init__(self, documents: List[str]):
        # 分割文档
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        chunks = splitter.create_documents(documents)
        
        # 创建向量库
        embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.from_documents(chunks, embeddings)
        
        # 构建 RAG 链
        self.retriever = self.vectorstore.as_retriever()
        
        prompt = ChatPromptTemplate.from_template("""基于以下上下文回答问题：

上下文：
{context}

问题：{question}

如果上下文中没有答案，请说"我不知道"。
回答：""")
        
        model = ChatAnthropic(model="claude-sonnet-4-5")
        
        self.rag_chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | prompt
            | model
            | StrOutputParser()
        )
    
    def ask(self, question: str) -> str:
        return self.rag_chain.invoke(question)
```

---

## 场景 3：代码助手

### 完整实现

```python
# coding_assistant.py
from langchain.agents import create_agent
from langchain_core.tools import tool
import subprocess

class CodingAssistant:
    def __init__(self):
        @tool
        def read_file(path: str) -> str:
            """读取文件内容"""
            with open(path, 'r') as f:
                return f.read()
        
        @tool
        def write_file(path: str, content: str) -> str:
            """写入文件"""
            with open(path, 'w') as f:
                f.write(content)
            return f"已写入 {path}"
        
        @tool
        def run_command(command: str) -> str:
            """运行 shell 命令"""
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            return f"stdout: {result.stdout}\nstderr: {result.stderr}"
        
        @tool
        def explain_code(code: str) -> str:
            """解释代码功能"""
            # 会由 LLM 直接处理
            pass
        
        self.agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[read_file, write_file, run_command],
            system_prompt="""你是编程助手，可以：
1. 读取和修改代码文件
2. 运行命令测试代码
3. 解释代码功能
4. 提供优化建议

注意：修改文件前先备份，危险操作要确认。""",
        )
    
    async def help(self, task: str) -> str:
        result = await self.agent.ainvoke({
            "messages": [{"role": "user", "content": task}]
        })
        return result["messages"][-1].content
```

---

## 场景 4：数据分析助手

### 完整实现

```python
# data_analyst.py
import pandas as pd
from langchain.agents import create_agent
from langchain_core.tools import tool

class DataAnalyst:
    def __init__(self, data_path: str):
        self.df = pd.read_csv(data_path)
        
        @tool
        def describe_data() -> str:
            """查看数据基本信息"""
            return f"""
行数：{len(self.df)}
列数：{len(self.df.columns)}
列名：{list(self.df.columns)}
前 5 行:\n{self.df.head().to_string()}
            """
        
        @tool
        def get_statistics(column: str) -> str:
            """获取列的统计信息"""
            if column not in self.df.columns:
                return f"列'{column}'不存在"
            
            col = self.df[column]
            if pd.api.types.is_numeric_dtype(col):
                return col.describe().to_string()
            return col.value_counts().head(10).to_string()
        
        @tool
        def filter_data(condition: str) -> str:
            """筛选数据"""
            try:
                filtered = self.df.query(condition)
                return f"筛选结果：{len(filtered)} 行\n{filtered.head().to_string()}"
            except Exception as e:
                return f"筛选错误：{e}"
        
        @tool
        def group_aggregate(group_col: str, agg_col: str, agg_func: str) -> str:
            """分组聚合"""
            try:
                result = self.df.groupby(group_col)[agg_col].agg(agg_func)
                return result.to_string()
            except Exception as e:
                return f"聚合错误：{e}"
        
        self.agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[describe_data, get_statistics, filter_data, group_aggregate],
            system_prompt="你是数据分析专家，用 Python pandas 分析数据。",
        )
    
    async def analyze(self, question: str) -> str:
        result = await self.agent.ainvoke({
            "messages": [{"role": "user", "content": question}]
        })
        return result["messages"][-1].content
```

---

## 场景 5：工作流自动化

### 完整实现

```python
# workflow_automation.py
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List

class WorkflowState(TypedDict):
    input_data: dict
    processed_data: dict
    output: str
    errors: List[str]

class WorkflowAutomation:
    def __init__(self):
        # 创建工作流图
        graph = StateGraph(WorkflowState)
        
        # 添加节点
        graph.add_node("validate", self.validate_input)
        graph.add_node("transform", self.transform_data)
        graph.add_node("enrich", self.enrich_data)
        graph.add_node("generate_report", self.generate_report)
        
        # 添加边
        graph.add_edge(START, "validate")
        graph.add_edge("validate", "transform")
        graph.add_edge("transform", "enrich")
        graph.add_edge("enrich", "generate_report")
        graph.add_edge("generate_report", END)
        
        self.workflow = graph.compile()
    
    def validate_input(self, state: WorkflowState) -> dict:
        """验证输入数据"""
        data = state["input_data"]
        errors = []
        
        if not data.get("name"):
            errors.append("缺少姓名")
        if not data.get("email"):
            errors.append("缺少邮箱")
        
        return {
            "processed_data": data,
            "errors": errors
        }
    
    def transform_data(self, state: WorkflowState) -> dict:
        """转换数据格式"""
        data = state["processed_data"]
        data["email"] = data["email"].lower().strip()
        data["name"] = data["name"].title()
        return {"processed_data": data}
    
    def enrich_data(self, state: WorkflowState) -> dict:
        """丰富数据"""
        data = state["processed_data"]
        data["processed_at"] = datetime.now().isoformat()
        data["source"] = "automated_workflow"
        return {"processed_data": data}
    
    def generate_report(self, state: WorkflowState) -> dict:
        """生成报告"""
        data = state["processed_data"]
        report = f"""
=== 处理报告 ===
姓名：{data['name']}
邮箱：{data['email']}
处理时间：{data['processed_at']}
来源：{data['source']}
================
        """
        return {"output": report}
    
    async def run(self, input_data: dict) -> str:
        result = await self.workflow.ainvoke({
            "input_data": input_data,
            "processed_data": {},
            "output": "",
            "errors": [],
        })
        return result["output"]
```

---

## 生产化检查清单

### 安全性
- [ ] API 密钥管理（使用环境变量或密钥管理服务）
- [ ] 输入验证和清理
- [ ] 输出过滤（防止注入）
- [ ] 访问控制和认证

### 可靠性
- [ ] 错误处理和重试
- [ ] 超时设置
- [ ] 降级策略
- [ ] 监控和告警

### 性能
- [ ] 缓存策略
- [ ] 并发控制
- [ ] 资源限制
- [ ] 性能测试

### 可维护性
- [ ] 日志记录
- [ ] 配置管理
- [ ] 版本控制
- [ ] 文档完善

---

## ✅ 本章检查清单

- [ ] 理解 5 个生产场景
- [ ] 掌握 RAG 实现
- [ ] 学会工作流设计
- [ ] 完成生产化检查

---

**上一章**: [第五章：设计模式](../05-design-patterns/README.md)  
**下一章**: [第七章：LangGraph + Deep Agents](../07-langgraph-deepagents/README.md)
