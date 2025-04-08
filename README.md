# DomainKnowledgeStudy-Client

## 项目介绍
DomainKnowledgeStudy-Client 是一个针对领域知识库的学习、出题和考核的 Web 系统。该系统通过与 LLM-RAG 系统对接，实现了智能化的知识学习和考核流程。

### 主要功能
- **学习模块**：基于知识库生成学习大纲，提供交互式问答界面
- **出题模块**：自动生成题目（含答案及分析），支持选择题与问答题
- **考核模块**：随机抽题组卷，自动批改，记录历史成绩
- **智能评分**：选择题自动批改，问答题由 LLM 系统智能评分
- **学习反馈**：考核后可查看详细批改结果和答案分析

## 技术栈
- **框架**: Vue 3 + TypeScript + Vite
- **状态管理**: Pinia
- **UI 组件**: Element Plus
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **Markdown 渲染**: Marked
- **测试工具**: Vitest + Testing Library

## 项目结构
```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源文件
├── components/   # 通用组件
├── composables/  # 组合式函数
├── layouts/      # 布局组件
├── router/       # 路由配置
├── services/     # 业务服务层
├── stores/       # Pinia 状态管理
├── test/         # 测试文件
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
├── views/        # 页面视图组件
└── App.vue       # 根组件
```

## 开发环境设置

### 前置要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test

# 运行测试（UI界面）
npm run test:ui

# 生成测试覆盖率报告
npm run coverage
```

### 环境变量配置
项目包含以下环境配置文件：
- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置

## 代码规范
项目遵循严格的代码规范，详见 [CODE_STYLE.md](CODE_STYLE.md)。

## 测试
- 单元测试覆盖率要求：90%以上
- API测试覆盖率要求：100%
- 运行测试：`npm run test`
- 查看测试覆盖率：`npm run coverage`

## 部署
1. 执行构建命令：`npm run build`
2. 将 `dist` 目录下的文件部署到 Web 服务器

## 许可证
本项目基于 [MIT 许可证](LICENSE) 开源。

## 贡献指南
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 联系方式
如有问题或建议，请提交 Issue 或 Pull Request。 