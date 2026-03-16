# NestJS + LangChain 学习平台

本目录包含基于 NestJS 的 LangChain 学习平台，提供 REST API 接口和完整的单元测试。

## 📦 项目结构

```
langchain-learning/
├── nest-src/                    # NestJS 源码
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── modules/                # 功能模块（10 个章节）
│   │   ├── health/             # 健康检查
│   │   ├── core-value/         # 01 章：核心价值
│   │   ├── architecture/       # 02 章：架构
│   │   ├── quickstart/         # 03 章：快速入门
│   │   ├── components/         # 04 章：组件
│   │   ├── design-patterns/    # 05 章：设计模式
│   │   ├── production/         # 06 章：生产场景
│   │   ├── langgraph/          # 07 章：LangGraph
│   │   ├── engineering/        # 08 章：工程化
│   │   ├── troubleshooting/    # 09 章：故障排查
│   │   └── learning-path/      # 10 章：学习路径
│   ├── services/               # 共享服务
│   └── common/                 # 共享工具
├── test/                       # 单元测试
│   └── modules/                # 模块测试
│       ├── *.spec.ts
├── nest-cli.json               # Nest CLI 配置
├── jest.config.ts              # Jest 测试配置
└── tsconfig.nest.json          # NestJS TypeScript 配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动 NestJS 开发服务器
npm run nest:start:dev

# 访问 http://localhost:3001/api
```

### 构建生产版本

```bash
# 编译
npm run nest:build

# 启动生产服务器
npm run nest:start:prod
```

## 🧪 测试

### 运行所有测试

```bash
npm run test:nest
```

### 监听模式

```bash
npm run test:nest:watch
```

### 生成覆盖率报告

```bash
npm run test:nest:coverage

# 查看 ./coverage-nest/lcov-report/index.html
```

## 📡 API 端点

### 健康检查

```bash
GET /api/health
```

### 01 - 核心价值

```bash
GET  /api/core-value/providers     # 获取支持的模型提供商
GET  /api/core-value/compare       # 比较不同提供商
POST /api/core-value/anthropic     # 使用 Claude 模型
POST /api/core-value/openai        # 使用 GPT 模型
```

### 02 - 架构

```bash
GET  /api/architecture/message-flow    # 消息流演示
POST /api/architecture/prompt-template # 提示词模板
GET  /api/architecture/tools           # 工具定义
POST /api/architecture/execute-tool    # 执行工具
```

### 03 - 快速入门

```bash
GET /api/quickstart/guide    # 快速入门指南
POST /api/quickstart/chat    # 简单对话
GET  /api/quickstart/tool    # 创建工具
```

### 04 - 组件

```bash
GET  /api/components         # 六大核心组件
GET  /api/components/prompt  # 提示词演示
POST /api/components/chain   # Chain 演示
GET  /api/components/tool    # 工具演示
```

### 05 - 设计模式

```bash
GET  /api/design-patterns    # 设计模式列表
POST /api/design-patterns/chain  # 链式模式演示
```

### 06 - 生产场景

```bash
GET  /api/production/scenarios   # 生产场景列表
POST /api/production/rag         # RAG 模拟
```

### 07 - LangGraph

```bash
GET  /api/langgraph/basic        # 基础状态图
GET  /api/langgraph/deep-agents  # Deep Agents 图
POST /api/langgraph/execute      # 执行图
```

### 08 - 工程化

```bash
GET /api/engineering/practices    # 工程化实践
GET /api/engineering/structure    # 项目结构
```

### 09 - 故障排查

```bash
GET /api/troubleshooting/issues   # 常见问题
GET /api/troubleshooting/tips     # 调试技巧
```

### 10 - 学习路径

```bash
GET /api/learning-path           # 学习路径
GET /api/learning-path/resources # 学习资源
```

## 📝 测试示例

### 使用 curl 测试

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取模型提供商
curl http://localhost:3001/api/core-value/providers

# 获取组件列表
curl http://localhost:3001/api/components

# 执行工具
curl -X POST http://localhost:3001/api/architecture/execute-tool \
  -H "Content-Type: application/json" \
  -d '{"toolName":"add","params":{"a":3,"b":5}}'
```

### 使用 Postman/Insomnia

导入集合或手动创建请求，设置 Content-Type 为 `application/json`。

## 🏗️ 模块设计

每个章节模块包含：

- **Module**: 定义模块结构和依赖
- **Service**: 实现业务逻辑（LangChain 功能）
- **Controller**: 提供 REST API 端点
- **DTO**: 请求/响应类型定义
- **Spec**: 完整的单元测试

## ✅ 测试覆盖率

目标：>80%

运行测试覆盖率：

```bash
npm run test:nest:coverage
```

查看报告：

```bash
open ./coverage-nest/lcov-report/index.html
```

## 🔧 开发指南

### 添加新模块

1. 在 `nest-src/modules/` 创建新目录
2. 创建 `*.module.ts`, `*.service.ts`, `*.controller.ts`
3. 在 `app.module.ts` 中导入
4. 在 `test/modules/` 创建测试文件

### 代码规范

```bash
# 格式化
npm run format:nest

# 检查
npm run lint:nest

# 类型检查
npm run typecheck:nest
```

## 📚 学习资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [LangChain.js 文档](https://js.langchain.com/)
- [Jest 测试框架](https://jestjs.io/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**最后更新**: 2026-03-16  
**版本**: 1.0.0
