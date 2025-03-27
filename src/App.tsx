import { useState, useRef, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Container, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Divider, Button } from '@mui/material';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import APIKeyModal from './components/APIKeyModal';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface SavedChat {
  id: string;
  name: string;
  messages: {
    role: string;
    content: string;
  }[];
  date: string;
  systemPrompt?: string; // 添加可选的系统提示字段，兼容旧版数据
  autoSaved?: boolean; // 是否为自动保存的对话
}

// 主题设置
const theme = createTheme({
  palette: {
    primary: {
      main: '#0a58ca',
    },
    secondary: {
      main: '#6c757d',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
        },
      },
    },
  },
});

function App() {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('deepseekApiKey') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(!apiKey);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [currentChat, setCurrentChat] = useState<SavedChat | null>(null);

  // 保存API密钥到本地存储
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('deepseekApiKey', apiKey);
    }
  }, [apiKey]);

  // 加载保存的聊天记录
  useEffect(() => {
    const loadSavedChats = () => {
      const chats = localStorage.getItem('deepseekSavedChats');
      if (chats) {
        try {
          const parsedChats = JSON.parse(chats) as SavedChat[];
          setSavedChats(parsedChats);
        } catch (e) {
          console.error('解析保存的聊天记录失败:', e);
        }
      }
    };

    loadSavedChats();
    // 每次打开抽屉时重新加载
    if (drawerOpen) {
      loadSavedChats();
    }
  }, [drawerOpen]);

  // 组件卸载时，恢复原始system prompt
  useEffect(() => {
    return () => {
      clearTempSystemPrompt();
    };
  }, []);

  // 处理选择聊天记录
  const handleSelectChat = (chat: SavedChat) => {
    setCurrentChat(chat);
    
    // 如果保存的对话中有system prompt，则临时恢复它
    if (chat.systemPrompt) {
      localStorage.setItem('tempSystemPrompt', localStorage.getItem('deepseekSystemPrompt') || '');
      localStorage.setItem('deepseekSystemPrompt', chat.systemPrompt);
    }
    
    setDrawerOpen(false);
  };

  // 清除临时系统提示并恢复用户设置的系统提示
  const clearTempSystemPrompt = () => {
    const tempPrompt = localStorage.getItem('tempSystemPrompt');
    if (tempPrompt !== null) {
      localStorage.setItem('deepseekSystemPrompt', tempPrompt);
      localStorage.removeItem('tempSystemPrompt');
    }
  };

  // 当用户点击创建新对话时，清除临时系统提示
  const handleNewChat = () => {
    clearTempSystemPrompt();
    setCurrentChat(null);
  };

  // 删除保存的聊天记录
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChats = savedChats.filter(chat => chat.id !== id);
    setSavedChats(updatedChats);
    localStorage.setItem('deepseekSavedChats', JSON.stringify(updatedChats));
    
    // 如果删除的是当前聊天，清空当前聊天
    if (currentChat && currentChat.id === id) {
      setCurrentChat(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden'
      }}>
        <Header 
          apiKey={apiKey} 
          onSettingsClick={() => setShowApiKeyModal(true)}
          onHistoryClick={() => setDrawerOpen(true)}
          onNewChatClick={handleNewChat}
          hasHistory={savedChats.length > 0}
        />
        <Container maxWidth="lg" sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          mt: 2, 
          mb: 2 
        }}>
          <ChatInterface 
            apiKey={apiKey} 
            initialMessages={currentChat ? currentChat.messages : undefined}
            onNewChat={handleNewChat}
          />
        </Container>
      </Box>
      <APIKeyModal 
        open={showApiKeyModal} 
        apiKey={apiKey} 
        onSave={(key) => {
          setApiKey(key);
          setShowApiKeyModal(false);
        }}
        onClose={() => {
          if (apiKey) setShowApiKeyModal(false);
        }}
      />

      {/* 保存的聊天记录抽屉 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6">保存的对话</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            handleNewChat();
            setDrawerOpen(false);
          }}
          sx={{ mx: 2, my: 1 }}
        >
          新建对话
        </Button>
        
        <Divider sx={{ my: 1 }} />
        
        {savedChats.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">暂无保存的对话</Typography>
          </Box>
        ) : (
          <List sx={{ overflow: 'auto' }}>
            {savedChats.map((chat) => (
              <ListItem 
                key={chat.id} 
                button 
                onClick={() => handleSelectChat(chat)}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={chat.autoSaved ? { backgroundColor: 'rgba(16, 163, 127, 0.08)' } : {}}
              >
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <>
                      {chat.name}
                      {chat.autoSaved && (
                        <Typography 
                          component="span" 
                          variant="caption" 
                          sx={{ 
                            ml: 1, 
                            color: 'text.secondary',
                            backgroundColor: 'rgba(16, 163, 127, 0.15)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          自动
                        </Typography>
                      )}
                    </>
                  }
                  secondary={new Date(chat.date).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
    </ThemeProvider>
  );
}

export default App; 