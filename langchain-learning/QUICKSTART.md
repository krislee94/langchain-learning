# 🚀 快速启动指南

> 5 分钟开始学习 LangChain

---

## 第一步：环境准备（3 分钟）

### 1. 创建虚拟环境

```bash
cd langchain-learning
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
```

### 2. 安装依赖

```bash
# 核心包
pip install langchain langchain-core langchain-community

# 选择你的模型提供商（至少一个）
pip install langchain-anthropic    # Claude
pip install langchain-openai       # GPT
pip install langchain-google-genai # Gemini

# 可选：LangGraph 和 LangSmith
pip install langgraph langsmith
```

### 3. 设置 API 密钥

```bash
# 创建.env 文件
cat > .env << EOF
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
LANGSMITH_API_KEY=your-key-here
LANGSMITH_TRACING=true
EOF
```

---

## 第二步：运行第一个 Demo（1 分钟）

```bash
# 运行第一个 Agent 示例
python 01-core-value/demos/02-first-agent.py
```

**预期输出：**
```
============================================================
LangChain 学习 - 实验 1-2：创建第一个 Agent
============================================================

📝 问题：北京今天天气怎么样？
------------------------------------------------------------
🤖 回复：北京今天晴朗，温度 25°C，湿度 40%。
```

---

## 第三步：开始学习（持续）

### 推荐学习顺序

```
1. 阅读根目录 README.md（5 分钟）
   ↓
2. 第 1 章：核心价值与行业地位（30 分钟）
   ↓
3. 第 2 章：底层架构与运行原理（45 分钟）
   ↓
4. 第 3 章：快速上手（30 分钟 + 动手）
   ↓
5. 第 4-10 章：深入学习（每章 1-2 小时）
```

### 每章学习方法

1. **阅读 README.md** - 理解概念
2. **运行 Demo 代码** - 动手实践
3. **完成检查清单** - 自我测试
4. **记录笔记** - 加深理解

---

## 常见问题

### Q: 没有 API 密钥怎么办？

A: 可以先阅读理论部分，Demo 代码会显示需要哪些配置。

- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/
- Google: https://makersuite.google.com/

### Q: 遇到错误怎么办？

A: 
1. 检查 [第 9 章：避坑指南](./09-troubleshooting/README.md)
2. 查看错误信息，搜索解决方案
3. 在 Discord 社区提问

### Q: 学完需要多长时间？

A: 
- **快速入门**：1 周（每天 1 小时）
- **系统学习**：1 月（每天 1-2 小时）
- **精通掌握**：3 月+（持续实践）

---

## 学习支持

### 官方资源
- [LangChain 文档](https://docs.langchain.com/)
- [LangChain Discord](https://discord.gg/langchain)
- [LangChain 博客](https://blog.langchain.dev/)

### 本仓库资源
- [完整学习路线](./10-learning-path/README.md)
- [避坑指南](./09-troubleshooting/README.md)
- [完成总结](./COMPLETION_SUMMARY.md)

---

## 学习打卡模板

```markdown
## Day 1 - 2026-03-11

### 学习内容
- [x] 环境配置
- [x] 第 1 章阅读
- [x] 运行第一个 Demo

### 遇到的问题
- API 密钥配置

### 收获
- 理解了 LangChain 的核心价值
- 成功创建了第一个 Agent

### 明天计划
- 学习第 2 章
- 运行更多 Demo
```

---

**开始学习吧！🎓**

有任何问题都可以在 Discord 社区或 GitHub Issue 中提问。
