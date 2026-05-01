# DrawFlow V4

> 跨平台 AI 图片生成桌面应用（macOS + Windows）

---

## 项目简介

DrawFlow V4 是一款符合 Apple 和 Microsoft 官方规范的跨平台 AI 图片生成桌面应用。采用 Electron + Node.js 技术栈，无需外部依赖（如 Python），双击即可运行。

---

## 核心功能

- 🎨 **自定义模板生图**：上传参考图，输入提示词，生成高质量图片
- 📸 **多图生成**：支持一次生成 1-4 张图片
- 🖼️ **历史记录**：自动保存所有生成记录，支持查看和重新生成
- ☁️ **OSS 集成**：参考图和生成图自动上传到阿里云 OSS
- 💾 **本地存储**：SQLite 数据库 + 本地文件，数据安全

---

## 技术栈

- **桌面框架**：Electron 28
- **后端框架**：Express (Node.js)
- **前端框架**：Vue 3 + Tailwind CSS
- **数据库**：sql.js (SQLite)
- **AI 服务**：即梦 AI (Seedream)
- **存储**：阿里云 OSS

---

## 快速开始

### 开发模式

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 .env 文件，填入你的 OSS 和火山引擎凭证

# 3. 启动应用
npm run dev
```

### 打包应用

```bash
# 打包 macOS 版本
npm run build:mac

# 打包 Windows 版本
npm run build:win

# 打包双平台
npm run build:all
```

---

## 项目结构

```
drawflow-v4/
├── src/                      # 前端代码
│   └── index.html            # 主界面
├── backend/                  # Node.js 后端
│   ├── server.js             # 主入口
│   ├── config/               # 配置管理
│   ├── routes/               # API 路由
│   ├── services/             # 核心服务
│   └── utils/                # 工具函数
├── build/                    # 构建资源
│   ├── icon.icns             # macOS 图标
│   └── icon.ico              # Windows 图标
├── docs/                     # 开发文档
│   ├── spec.md               # 需求规格
│   ├── tasks.md              # 任务清单
│   └── checklist.md          # 检查清单
├── main.js                   # Electron 主进程
├── preload.js                # 预加载脚本
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

---

## 配置说明

### 环境变量 (.env)

```env
# 火山引擎配置
VOLC_ACCESS_KEY_ID=your_access_key_id
VOLC_ACCESS_KEY_SECRET=your_access_key_secret

# 阿里云 OSS 配置
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name
OSS_REGION=oss-cn-shanghai

# Flask 服务配置
FLASK_PORT=5001
```

---

## 交付物

| 平台 | 安装包 | 压缩包 |
|------|--------|--------|
| macOS | `.dmg` | `.zip` |
| Windows | `.exe` | `.zip` |

---

## 许可证

MIT License
