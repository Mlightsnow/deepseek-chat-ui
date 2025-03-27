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

### 系统提示(System Prompt)

1. 点击保存图标，选择"设置System Prompt"。
2. 在对话框中输入您想要的系统提示。
3. 系统提示是给AI的基本指令，它会指导AI如何回应您的问题。

### 保存对话历史

1. 点击保存图标，选择"保存对话"。
2. 输入对话名称后点击保存。
3. 保存的对话可以通过右上角的历史记录按钮查看。
4. 您也可以通过保存图标中的"导出为JSON"选项将当前对话导出为JSON文件。

## 部署

要构建生产版本，请运行：

```
npm run build
```

构建文件将位于`dist`目录中，可以部署到任何静态网站托管服务。

## 许可证

本项目采用 [MIT 许可证](LICENSE) 进行许可。 