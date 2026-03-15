# 第三章：零基础快速上手 - 5 分钟搭建第一个 AI 应用

> 从零开始，快速构建可运行的 AI 应用

---

## 📌 本章学习目标

- 完成开发环境配置
- 创建第一个 LangChain 应用
- 理解基本工作流程
- 能够独立扩展功能

---

## 3.1 环境配置（5 分钟）

### 3.1.1 创建项目

```bash
# 创建项目目录
mkdir my-first-ai-app
cd my-first-ai-app

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
```

### 3.1.2 安装依赖

```bash
# 核心包
pip install langchain langchain-core

# 选择你的模型提供商（至少安装一个）
pip install langchain-anthropic    # Anthropic Claude
pip install langchain-openai       # OpenAI GPT
pip install langchain-google-genai # Google Gemini

# LangGraph（用于复杂工作流）
pip install langgraph

# LangSmith（用于调试和观测）
pip install langsmith
```

### 3.1.3 设置 API 密钥

```bash
# macOS/Linux
export ANTHROPIC_API_KEY="your-key-here"
export OPENAI_API_KEY="your-key-here"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-key-here"
$env:OPENAI_API_KEY="your-key-here"

# 或创建 .env 文件
echo "ANTHROPIC_API_KEY=your-key-here" > .env
```

### 3.1.4 验证安装

```python
# test_install.py
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage

model = ChatAnthropic(model="claude-sonnet-4-5")
response = model.invoke([HumanMessage("说你好")])
print(response.content)
```

---

## 3.2 第一个应用：智能问答助手

### 3.2.1 基础版本（5 行代码）

```python
# app_v1.py
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage

model = ChatAnthropic(model="claude-sonnet-4-5")
response = model.invoke([HumanMessage("Python 和 JavaScript 哪个更适合初学者？")])
print(response.content)
```

### 3.2.2 添加系统指令

```python
# app_v2.py
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

model = ChatAnthropic(model="claude-sonnet-4-5")

messages = [
    SystemMessage(content="你是一个友好的编程导师，擅长用简单易懂的方式解释概念。"),
    HumanMessage(content="Python 和 JavaScript 哪个更适合初学者？"),
]

response = model.invoke(messages)
print(response.content)
```

### 3.2.3 使用提示词模板

```python
# app_v3.py
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

# 定义模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是{role}，{style}"),
    ("human", "{question}"),
])

# 创建模型
model = ChatAnthropic(model="claude-sonnet-4-5")

# 组合成链
chain = prompt | model

# 使用
response = chain.invoke({
    "role": "编程导师",
    "style": "擅长用简单易懂的方式解释概念",
    "question": "Python 和 JavaScript 哪个更适合初学者？"
})

print(response.content)
```

---

## 3.3 添加工具：让 AI 能做事

### 3.3.1 定义工具

```python
# app_v4.py
from langchain.agents import create_agent
from langchain_core.tools import tool

# 定义工具
@tool
def get_weather(city: str) -> str:
    """获取城市天气"""
    weather = {
        "北京": "晴朗，25°C",
        "上海": "多云，22°C",
        "广州": "小雨，28°C",
    }
    return weather.get(city, "天气数据暂不可用")

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except:
        return "计算失败"

# 创建 Agent
agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[get_weather, calculate],
    system_prompt="你是有帮助的助手，可以查询天气和进行计算。",
)

# 测试
result = agent.invoke({
    "messages": [{"role": "user", "content": "北京天气怎么样？"}]
})
print(result)
```

### 3.3.2 多轮对话

```python
# app_v5.py
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取城市天气"""
    return f"{city} 晴朗，25°C"

agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[get_weather],
    system_prompt="你是天气助手。",
)

# 多轮对话
messages = []

while True:
    user_input = input("你：")
    if user_input.lower() in ["退出", "quit", "exit"]:
        break
    
    messages.append({"role": "user", "content": user_input})
    
    result = agent.invoke({"messages": messages})
    
    # 获取 AI 回复
    ai_message = result["messages"][-1]
    print(f"助手：{ai_message.content}")
    
    messages.append({"role": "user", "content": ai_message.content})
```

---

## 3.4 完整示例：研究助手

### 3.4.1 功能需求

- 可以回答一般问题
- 可以计算数学题
- 可以查询天气
- 记住对话历史

### 3.4.2 完整代码

```python
# research_assistant.py
from langchain.agents import create_agent
from langchain_core.tools import tool
from datetime import datetime

# 工具定义
@tool
def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    weather_data = {
        "北京": "晴朗，温度 25°C，湿度 40%",
        "上海": "多云，温度 22°C，湿度 65%",
        "广州": "小雨，温度 28°C，湿度 80%",
        "深圳": "晴朗，温度 30°C，湿度 70%",
        "杭州": "阴天，温度 23°C，湿度 55%",
    }
    return weather_data.get(city, f"{city} 天气数据暂不可用")

@tool
def calculate(expression: str) -> str:
    """计算数学表达式，支持加减乘除和括号"""
    try:
        # 安全检查
        allowed_chars = set("0123456789+-*/.() ")
        if not all(c in allowed_chars for c in expression):
            return "错误：只支持数字和运算符"
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except Exception as e:
        return f"计算错误：{e}"

@tool
def get_time() -> str:
    """获取当前日期和时间"""
    now = datetime.now()
    return now.strftime("%Y 年%m 月%d 日 %H:%M:%S")

# 创建 Agent
agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[get_weather, calculate, get_time],
    system_prompt="""你是一个研究助手，可以帮助用户：
1. 回答一般知识问题
2. 查询天气（使用 get_weather 工具）
3. 进行数学计算（使用 calculate 工具）
4. 告诉用户当前时间（使用 get_time 工具）

请用友好、专业的方式回答。使用工具前先思考是否真的需要。""",
)

# 主程序
def main():
    print("=" * 60)
    print("🤖 研究助手 - 按 Ctrl+C 或输入'退出'结束")
    print("=" * 60)
    
    messages = []
    
    while True:
        try:
            user_input = input("\n你：").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ["退出", "quit", "exit", "bye"]:
                print("助手：再见！祝你有美好的一天！")
                break
            
            messages.append({"role": "user", "content": user_input})
            
            result = agent.invoke({"messages": messages})
            
            # 获取并显示 AI 回复
            ai_message = result["messages"][-1]
            print(f"\n助手：{ai_message.content}")
            
            # 添加到历史
            messages.append({"role": "assistant", "content": ai_message.content})
            
        except KeyboardInterrupt:
            print("\n\n助手：再见！")
            break
        except Exception as e:
            print(f"\n错误：{e}")
            messages = []  # 清空历史重新开始

if __name__ == "__main__":
    main()
```

### 3.4.3 运行效果

```
============================================================
🤖 研究助手 - 按 Ctrl+C 或输入'退出'结束
============================================================

你：北京天气怎么样？

助手：北京今天晴朗，温度 25°C，湿度 40%。是个好天气！

你：123 * 456 等于多少？

助手：123 * 456 = 56088

你：现在几点了？

助手：现在是 2026 年 03 月 11 日 14:30:45

你：谢谢！

助手：不客气！还有其他问题吗？
```

---

## 3.5 部署到生产

### 3.5.1 添加错误处理

```python
import os
from dotenv import load_dotenv

load_dotenv()  # 加载.env 文件

def create_safe_agent():
    """创建带有错误处理的 Agent"""
    try:
        agent = create_agent(
            model="claude-sonnet-4-5",
            tools=[get_weather, calculate, get_time],
            system_prompt="你是研究助手",
        )
        return agent
    except Exception as e:
        print(f"创建 Agent 失败：{e}")
        print("请检查 API KEY 是否正确设置")
        return None
```

### 3.5.2 添加日志

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def main():
    logging.info("研究助手启动")
    # ... 主程序 ...
    logging.info(f"用户输入：{user_input}")
```

### 3.5.3 使用 LangSmith 追踪

```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "ls__..."

# 所有调用会自动追踪
# 访问 https://smith.langchain.com 查看
```

---

## 🧪 动手实验

### 实验 3-1：创建你的第一个应用

复制 `research_assistant.py` 并运行。

### 实验 3-2：添加新工具

添加一个查询新闻或股票价格的工具。

### 实验 3-3：修改人设

修改 `system_prompt` 让助手有不同的性格。

---

## 📚 延伸阅读

- [LangChain 快速开始](https://docs.langchain.com/oss/python/langchain/quickstart)
- [Deep Agents 快速开始](https://docs.langchain.com/oss/python/deepagents/quickstart)
- [LangSmith 入门](https://docs.langchain.com/langsmith/quickstart)

---

## ✅ 本章检查清单

- [ ] 完成环境配置
- [ ] 运行第一个应用
- [ ] 添加至少一个自定义工具
- [ ] 理解多轮对话原理
- [ ] 尝试使用 LangSmith 追踪

---

**上一章**: [第二章：底层架构与运行原理](../02-architecture/README.md)  
**下一章**: [第四章：六大核心组件实战](../04-components/README.md)
