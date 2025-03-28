# DeepSeek API 聊天界面

[English](README.md) | [简体中文](README_CN.md)

一个简单的聊天界面，用于通过DeepSeek API进行聊天。

## 功能特点

- 基于React和Vite构建的现代UI界面
- 支持Markdown格式的回复内容
- 本地存储API密钥
- 响应式设计
- 可自定义系统提示(System Prompt)
- 支持保存和管理对话历史
- 支持导出对话为JSON文件
- 流式输出，实时显示AI回复
- 一键创建新对话
- 移动端友好界面（响应式设计）

## 开始使用

1. 克隆此仓库
   ```
   git clone https://github.com/yourusername/deepseek-chat-ui.git
   cd deepseek-chat-ui
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 启动开发服务器
   ```
   npm run dev
   ```

4. 在浏览器中打开 http://localhost:3000

## 使用方法

1. 首次使用时，需要点击右上角"设置API密钥"按钮输入您的DeepSeek API密钥。
2. 在底部输入框中输入您的问题，然后点击"发送"按钮或按回车键发送。
3. 聊天记录将显示在上方的聊天区域中。
4. 您可以随时点击左下角的垃圾桶图标清除聊天记录。
5. 要开始新对话，可以点击右上角的"+"按钮或在历史记录侧边栏中选择"新建对话"。

### 系统提示(System Prompt)

1. 点击保存图标，选择"设置System Prompt"。
2. 在对话框中输入您想要的系统提示。
3. 系统提示是给AI的基本指令，它会指导AI如何回应您的问题。
4. 每个保存的对话都会保留其自己的系统提示。

### 保存对话历史

1. 点击保存图标，选择"保存对话"。
2. 输入对话名称后点击保存。
3. 保存的对话可以通过右上角的历史记录按钮查看。
4. 您也可以通过保存图标中的"导出为JSON"选项将当前对话导出为JSON文件。

## 部署

### 本地部署

要构建生产版本，请运行：

```
npm run build
```

构建文件将位于`dist`目录中，可以部署到任何静态网站托管服务。

### GitHub Pages部署

本项目支持自动部署到GitHub Pages：

1. Fork或克隆此仓库
2. 使用`npm install`安装依赖
3. 使用以下命令部署到GitHub Pages：
   ```
   npm run deploy
   ```
4. 您的应用将可通过`https://您的用户名.github.io/deepseek-chat-ui/`访问

### 移动端访问

应用设计时考虑了响应式UI，可在移动设备上访问：
- 在手机浏览器中打开部署的URL
- 如需获得更接近应用的体验，可从浏览器菜单中添加到主屏幕

## 在线演示

您可以在这里体验在线演示：[https://mlightsnow.github.io/deepseek-chat-ui/](https://mlightsnow.github.io/deepseek-chat-ui/)

## 许可证

本项目采用 [MIT 许可证](LICENSE) 进行许可。 