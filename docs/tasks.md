# DrawFlow V4 - 任务清单

## 阶段 1：项目初始化

### 任务 1.1：创建项目结构
- [ ] 创建目录结构
- [ ] 初始化 package.json
- [ ] 配置 ESLint/Prettier（可选）

### 任务 1.2：安装依赖
- [ ] 安装 Electron 相关依赖
- [ ] 安装 Express 相关依赖
- [ ] 安装数据库依赖
- [ ] 安装 OSS 依赖
- [ ] 安装工具库依赖

### 任务 1.3：配置 electron-builder
- [ ] 配置 macOS 打包
- [ ] 配置 Windows 打包
- [ ] 配置图标资源
- [ ] 配置输出目录

---

## 阶段 2：后端开发

### 任务 2.1：创建 Express 服务器
- [ ] 创建 server.js
- [ ] 配置中间件（CORS、JSON 解析）
- [ ] 配置静态文件服务
- [ ] 配置错误处理
- [ ] 测试服务器启动

### 任务 2.2：实现数据库服务
- [ ] 创建 database.js
- [ ] 实现 initDatabase()
- [ ] 实现 saveGeneration()
- [ ] 实现 getGenerations()
- [ ] 实现 getGenerationById()
- [ ] 实现 updateGenerationStatus()
- [ ] 测试数据库操作

### 任务 2.3：实现即梦 AI 服务
- [ ] 创建 jimeng.js
- [ ] 实现火山引擎签名算法
- [ ] 实现 submitTask()
- [ ] 实现 getTaskResult()
- [ ] 实现 generateImage()
- [ ] 测试即梦 AI API 调用

### 任务 2.4：实现 OSS 服务
- [ ] 创建 oss.js
- [ ] 初始化 OSS 客户端
- [ ] 实现 uploadFile()
- [ ] 实现 getUrl()
- [ ] 测试 OSS 功能

### 任务 2.5：实现文件上传
- [ ] 创建 upload.js
- [ ] 配置 multer
- [ ] 实现文件上传路由
- [ ] 实现文件验证
- [ ] 测试文件上传

### 任务 2.6：实现任务管理
- [ ] 创建 task.js
- [ ] 实现 createGenerateTask()
- [ ] 实现 submitToJimeng()
- [ ] 实现 pollTaskStatus()
- [ ] 实现 downloadImages()
- [ ] 实现 getTaskStatus()
- [ ] 测试任务流程

### 任务 2.7：实现 API 路由
- [ ] 创建 api.js
- [ ] 实现 POST /api/generate
- [ ] 实现 GET /api/generations
- [ ] 实现 GET /api/task/:id/status
- [ ] 测试所有 API 路由

---

## 阶段 3：前端开发

### 任务 3.1：复用 UI 设计
- [ ] 复制 jimeng-web-v2 的 index.html
- [ ] 调整样式适配 Electron
- [ ] 移除不需要的功能
- [ ] 测试页面显示

### 任务 3.2：实现 Electron 特有功能
- [ ] 创建 preload.js
- [ ] 实现系统托盘
- [ ] 实现快捷键
- [ ] 实现窗口控制
- [ ] 测试 Electron 功能

### 任务 3.3：实现前端 API 调用
- [ ] 修改 API 调用路径
- [ ] 实现文件上传
- [ ] 实现生图功能
- [ ] 实现历史记录
- [ ] 实现任务状态轮询
- [ ] 测试前端功能

### 任务 3.4：实现图片功能
- [ ] 实现图片预览
- [ ] 实现图片下载
- [ ] 实现图片删除
- [ ] 测试图片功能

---

## 阶段 4：集成与打包

### 任务 4.1：集成前后端
- [ ] 修改 main.js
- [ ] 配置窗口加载
- [ ] 测试集成效果

### 任务 4.2：配置打包
- [ ] 配置 package.json
- [ ] 配置图标
- [ ] 配置输出格式
- [ ] 测试打包命令

### 任务 4.3：生成安装包
- [ ] 生成 macOS 安装包（.dmg）
- [ ] 生成 macOS 压缩包（.zip）
- [ ] 生成 Windows 安装包（.exe）
- [ ] 生成 Windows 压缩包（.zip）
- [ ] 验证安装包

---

## 阶段 5：测试验证

### 任务 5.1：功能测试
- [ ] 测试自定义模板生图
- [ ] 测试多图生成
- [ ] 测试历史记录
- [ ] 测试 OSS 集成
- [ ] 测试@参考图功能

### 任务 5.2：跨平台测试
- [ ] 测试 macOS 运行
- [ ] 测试 Windows 运行
- [ ] 测试 macOS 安装
- [ ] 测试 Windows 安装

### 任务 5.3：性能测试
- [ ] 测试启动速度
- [ ] 测试生图速度
- [ ] 测试内存占用
- [ ] 测试 CPU 占用

### 任务 5.4：用户体验测试
- [ ] 测试 UI 响应
- [ ] 测试交互流畅度
- [ ] 测试错误提示
- [ ] 测试加载状态

---

## 任务优先级

| 优先级 | 任务 | 说明 |
|--------|------|------|
| P0 | 阶段 1、2、4 | 核心功能，必须完成 |
| P1 | 阶段 3 | 重要功能，应该完成 |
| P2 | 阶段 5 | 验证功能，建议完成 |

---

**文档版本**：v1.0
**创建日期**：2026-05-01
