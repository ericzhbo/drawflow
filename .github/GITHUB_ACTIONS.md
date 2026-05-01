# DrawFlow - GitHub Actions 使用指南

## 自动构建流程

项目已配置 GitHub Actions，每次推送代码时会自动在 **macOS** 和 **Windows** 上构建安装包。

## 触发条件

- 推送到 `main` 分支
- 创建 Pull Request
- 手动触发（workflow_dispatch）

## 构建产物

### macOS (macos-latest)
- `DrawFlow-mac.dmg` - DMG 安装包
- `DrawFlow-mac.zip` - ZIP 压缩包

### Windows (windows-latest)
- `DrawFlow Setup.exe` - NSIS 安装程序
- `DrawFlow-win.zip` - ZIP 压缩包

## 使用方式

### 1. 推送代码触发

```bash
cd /Users/eric/学习/projects/jimeng/drawflow-v4
git add .
git commit -m "fix: Windows path issue"
git push origin main
```

### 2. 手动触发

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Build DrawFlow** workflow
4. 点击 **Run workflow** 按钮

### 3. 下载构建产物

1. 进入 GitHub 仓库的 **Actions** 页面
2. 点击对应的 workflow run
3. 在页面底部的 **Artifacts** 区域下载文件

## 本地测试 Windows

如果你有 Windows 电脑或虚拟机：

1. 从 GitHub Actions 下载 `DrawFlow-win.zip`
2. 解压到任意目录
3. 在命令行运行：
   ```cmd
   cd 解压目录
   DrawFlow.exe
   ```

## 配置文件

- `.github/workflows/build.yml` - GitHub Actions 工作流配置
