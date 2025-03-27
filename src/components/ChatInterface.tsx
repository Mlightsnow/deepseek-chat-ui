import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  IconButton,
  Divider,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatInterfaceProps {
  apiKey: string;
  initialMessages?: Message[];
  onNewChat?: () => void;
}

interface SavedChat {
  id: string;
  name: string;
  messages: Message[];
  date: string;
}

const DEFAULT_SYSTEM_PROMPT = '你是由DeepSeek AI驱动的智能助手，请尽可能简洁、准确地回答用户问题。';

const ChatInterface = ({ apiKey, initialMessages, onNewChat }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    localStorage.getItem('deepseekSystemPrompt') || DEFAULT_SYSTEM_PROMPT
  );
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: systemPrompt }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 保存对话相关状态
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatName, setChatName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [systemPromptDialog, setSystemPromptDialog] = useState(false);
  const [tempSystemPrompt, setTempSystemPrompt] = useState(systemPrompt);

  // 加载初始消息
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      // 确保保留系统消息
      const hasSystemMessage = initialMessages.some(msg => msg.role === 'system');
      if (hasSystemMessage) {
        setMessages(initialMessages);
      } else {
        setMessages([
          { role: 'system', content: systemPrompt },
          ...initialMessages
        ]);
      }
    } else if (!initialMessages) {
      // 如果没有传入初始消息，则重置为默认
      setMessages([{ role: 'system', content: systemPrompt }]);
    }
  }, [initialMessages, systemPrompt]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 更新system prompt
  useEffect(() => {
    if (messages.length > 0 && messages[0].role === 'system') {
      setMessages(prev => [{ role: 'system', content: systemPrompt }, ...prev.slice(1)]);
    }
  }, [systemPrompt]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError('请先设置API密钥');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [...messages, userMessage],
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('API请求错误:', err);
      setError(
        err.response?.data?.error?.message || 
        err.message || 
        '与API通信时出错，请检查API密钥和网络连接'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'system', content: systemPrompt }
    ]);
    setError('');
    if (onNewChat) {
      onNewChat();
    }
  };

  // 打开菜单
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 保存当前聊天记录
  const handleSaveChat = () => {
    handleMenuClose();
    setShowSaveDialog(true);
  };

  // 确认保存聊天记录
  const confirmSaveChat = () => {
    if (!chatName.trim()) {
      return;
    }

    const savedChats: SavedChat[] = JSON.parse(localStorage.getItem('deepseekSavedChats') || '[]');
    
    const newChat: SavedChat = {
      id: Date.now().toString(),
      name: chatName,
      messages: messages,
      date: new Date().toISOString()
    };
    
    savedChats.push(newChat);
    localStorage.setItem('deepseekSavedChats', JSON.stringify(savedChats));
    
    setChatName('');
    setShowSaveDialog(false);
  };

  // 下载当前聊天记录为JSON文件
  const downloadChatAsJson = () => {
    handleMenuClose();
    
    const chatData = {
      name: "DeepSeek聊天记录",
      date: new Date().toLocaleString(),
      messages: messages.filter(m => m.role !== 'system')
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `deepseek-chat-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // 打开系统提示设置对话框
  const openSystemPromptDialog = () => {
    handleMenuClose();
    setTempSystemPrompt(systemPrompt);
    setSystemPromptDialog(true);
  };

  // 保存系统提示设置
  const saveSystemPrompt = () => {
    setSystemPrompt(tempSystemPrompt);
    localStorage.setItem('deepseekSystemPrompt', tempSystemPrompt);
    setSystemPromptDialog(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden'
    }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={0} 
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          p: 2, 
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          borderRadius: 2
        }}
        ref={chatContainerRef}
      >
        {messages.slice(1).map((message, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                mb: 1
              }}
            >
              <Box 
                sx={{ 
                  borderRadius: '50%', 
                  width: 32, 
                  height: 32, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: message.role === 'user' ? '#0a58ca' : '#10a37f',
                  color: 'white',
                  mr: 1,
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {message.role === 'user' ? '用' : 'AI'}
              </Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: message.role === 'user' ? '#0a58ca' : '#10a37f'
                }}
              >
                {message.role === 'user' ? '用户' : 'DeepSeek AI'}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                pl: 5,
                pr: 2,
                '& p': { marginBottom: '0.5rem' },
                '& ul, & ol': { marginLeft: '1rem' },
                '& pre': { 
                  backgroundColor: '#f1f1f1', 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  overflow: 'auto'
                },
                '& code': { 
                  backgroundColor: '#f1f1f1', 
                  padding: '0.1rem 0.3rem', 
                  borderRadius: '3px',
                  fontSize: '0.9em'
                }
              }}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <Typography variant="body1">{message.content}</Typography>
              )}
            </Box>
            
            {index < messages.length - 2 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 5, mt: 2 }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="textSecondary">
              正在思考...
            </Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Paper>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <IconButton 
          color="error" 
          onClick={clearChat} 
          sx={{ mt: 1, mr: 1 }}
          aria-label="清除聊天"
          title="清除聊天"
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          color="primary"
          onClick={handleMenuOpen}
          sx={{ mt: 1, mr: 1 }}
          aria-label="更多选项"
          title="更多选项"
        >
          <SaveIcon />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleSaveChat}>
            <ListItemIcon>
              <SaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>保存对话</ListItemText>
          </MenuItem>
          <MenuItem onClick={downloadChatAsJson}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>导出为JSON</ListItemText>
          </MenuItem>
          <MenuItem onClick={openSystemPromptDialog}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>设置System Prompt</ListItemText>
          </MenuItem>
        </Menu>
        
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          placeholder={apiKey ? "输入您的问题..." : "请先设置API密钥..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!apiKey || isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            }
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!input.trim() || !apiKey || isLoading}
          sx={{ ml: 1, minWidth: '120px', height: '56px' }}
        >
          发送
        </Button>
      </Box>

      {/* 保存聊天对话框 */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>保存对话</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="对话名称"
            type="text"
            fullWidth
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)} color="secondary">
            取消
          </Button>
          <Button onClick={confirmSaveChat} color="primary" disabled={!chatName.trim()}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 系统提示对话框 */}
      <Dialog 
        open={systemPromptDialog} 
        onClose={() => setSystemPromptDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>自定义系统提示</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            系统提示(System Prompt)是给AI的基本指令，它会指导AI如何回应您的问题。
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="系统提示"
            multiline
            rows={6}
            fullWidth
            value={tempSystemPrompt}
            onChange={(e) => setTempSystemPrompt(e.target.value)}
            placeholder="请输入您的系统提示..."
            variant="outlined"
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            示例: "你是由DeepSeek AI驱动的智能助手，请尽可能简洁、准确地回答用户问题。"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSystemPromptDialog(false)} color="secondary">
            取消
          </Button>
          <Button 
            onClick={() => {
              setTempSystemPrompt(DEFAULT_SYSTEM_PROMPT);
            }} 
            color="secondary"
          >
            重置为默认
          </Button>
          <Button 
            onClick={saveSystemPrompt} 
            color="primary"
            disabled={!tempSystemPrompt.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatInterface; 