# DomainKnowledgeStudy-Client 代码风格指南

## 项目概述
DomainKnowledgeStudy-Client 是一个针对领域知识库进行学习、出题和考核的 web 系统，主要特点包括：
1. 对接 LLM-RAG 系统，通过基于 JSON 的 API 进行访问，用于生成和处理学习、出题和考核模块的内容。
2. 学习模块：基于知识库生成学习大纲，并在交互式问答界面中提供知识点按钮，方便学员学习。
3. 出题模块：依据知识库自动生成题目（附答案及题目内容分析），题目确认后导入题库；支持选择题和问答题，同时按知识点分类，确保分布均衡。
4. 出题配置界面：可配置批量自动生成的考题，实现内容的增、删、改。
5. 考核模块：从题库中随机抽取题目，选择题自动批改，问答题由 LLM 系统批改，考核分数将作为历史记录保存。
6. 考核完成后，学员可查看批改结果（包括正确答案与 LLM 给出的问答题答案评论）及题目内容分析，便于提升学习效果。
7. 考核配置界面：可配置出题数量、知识点覆盖率、重点知识点及通过标准。

此文档定义了 DomainKnowledgeStudy-Client 的代码风格和规范，旨在确保整个代码库的一致性和可维护性。

## 技术栈
- Platform: web
- Framework: vue
- 关键依赖：
  - pinia
  - vue-router

## 风格指南

### 1.编码风格
- 遵循 Vue 官方风格指南 (Vue Style Guide)  https://vuejs.org/style-guide/  
- 遵循 Vue 官方最佳实践 (Vue Best Practices)  https://vuejs.org/style-guide/best-practices/  
- 遵循 ESLint 规则 (ESLint Rules)  https://eslint.vuejs.org/rules/  
- 遵循 Prettier 规则 (Prettier Rules)  https://prettier.vuejs.org/rules/  
- 遵循 JavaScript 风格指南 (JavaScript Style Guide)  https://github.com/airbnb/javascript  
- 遵循 TypeScript 风格指南 (TypeScript Style Guide)  https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules  
- 遵循 Vue 3 风格指南 (Vue 3 Style Guide)  https://vuejs.org/style-guide/  
- 遵循单文件组件 (Single File Component)  
https://vuejs.org/api/sfc-spec.html  


### 2.UI设计标准
- 遵循 Material Design 设计规范
  https://m3.material.io/  
- 遵循 Figma 设计规范
  https://www.figma.com/design/QeDZlKuZjNqYXgKDgK1Q8e/Figma-Design-System?node-id=0-1&t=0-0
- 遵循 Tailwind CSS 设计规范
  https://tailwindcss.com/  

### 3. 测试标准
- 测试规范, 遵循 Vue Test Utils 要求
  https://test-utils.vuejs.org/   
- 单元测试要求，覆盖率90%以上，在提交代码前，需要运行 `npm run test:unit` 检查单元测试覆盖率
- 接口测试要求，覆盖率100%，在提交代码前，需要运行 `npm run test:api` 检查接口测试覆盖率

### 4. 性能指南
- Bundle 优化
- 代码分割
- Lazy Loading
- 内存管理
- 状态管理
- 渲染优化
- 资源优化

### 5. 安全指南
- 认证处理
- 数据校验
- API 安全
- 依赖管理
- 环境变量管理
- 敏感数据处理
- 安全最佳实践

### 6. 开发流程
- Git 工作流程
- 分支命名
- 提交信息格式
- Pull Request 要求
- 代码评审流程
- CI/CD 实践
- 版本控制规范

## 最佳实践

### 1. 代码质量
- 保持函数小而专注
- 遵循 DRY 原则
- 关注点分离
- 使用有意义的命名
- 编写自说明代码
- 合理处理错误

### 2. 性能优化
- 优化 Bundle 大小
- 实现代码分割
- 采用合适缓存策略
- 优化渲染
- 遵循 Lazy Loading 模式

### 3. 可维护性
- 编写清晰文档
- 采用一致设计模式
- 实现健全错误处理
- 遵循 SOLID 原则
- 定期更新依赖

### 4. 协作
- 编写清晰提交信息
- 记录重大更改
- 维护更新日志
- 进行充分代码审查
- 分享开发经验


