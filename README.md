# DeepSeek API Chat Interface

[English](README.md) | [简体中文](README_CN.md)

A simple chat interface for interacting with the DeepSeek API.

## Features

- Modern UI built with React and Vite
- Markdown rendering for responses
- Local storage for API keys
- Responsive design
- Customizable system prompts
- Save and manage conversation history
- Export conversations as JSON files
- Streaming output for real-time responses
- Create new conversations with a single click
- Mobile-friendly interface (responsive design)

## Getting Started

1. Clone this repository
   ```
   git clone https://github.com/yourusername/deepseek-chat-ui.git
   cd deepseek-chat-ui
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Usage

1. Click the "Set API Key" button in the top-right corner to enter your DeepSeek API key.
2. Type your question in the input field at the bottom and click "Send" or press Enter.
3. The conversation will appear in the chat area above.
4. You can clear the conversation anytime by clicking the trash icon in the bottom-left corner.
5. To start a new conversation, click the "+" button in the top right or select "New Conversation" in the history sidebar.

### System Prompts

1. Click the save icon and select "Set System Prompt".
2. Enter your desired system prompt in the dialog box.
3. The system prompt is a basic instruction to the AI that guides how it responds to your questions.
4. Each saved conversation retains its own system prompt.

### Saving Conversations

1. Click the save icon and select "Save Conversation".
2. Enter a name for the conversation and click save.
3. Saved conversations can be accessed through the history button in the top-right corner.
4. You can also export the current conversation as a JSON file through the "Export as JSON" option.

## Deployment

### Local Deployment

To build for production:

```
npm run build
```

The build files will be located in the `dist` directory and can be deployed to any static site hosting service.

### GitHub Pages Deployment

This project supports automatic deployment to GitHub Pages:

1. Fork or clone this repository
2. Install dependencies with `npm install`
3. Deploy to GitHub Pages with:
   ```
   npm run deploy
   ```
4. Your app will be available at `https://yourusername.github.io/deepseek-chat-ui/`

### Mobile Access

The app is designed with responsive UI and can be accessed on mobile devices:
- Open the deployed URL in your mobile browser
- For a more app-like experience, add to home screen from your browser menu

## Live Demo

You can try the live demo at: [https://mlightsnow.github.io/deepseek-chat-ui/](https://mlightsnow.github.io/deepseek-chat-ui/)

## License

This project is licensed under the [MIT License](LICENSE). 