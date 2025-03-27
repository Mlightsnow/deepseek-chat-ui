import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';

interface HeaderProps {
  apiKey: string;
  onSettingsClick: () => void;
  onHistoryClick?: () => void;
  onNewChatClick?: () => void;
  hasHistory?: boolean;
}

const Header = ({ 
  apiKey, 
  onSettingsClick, 
  onHistoryClick, 
  onNewChatClick,
  hasHistory = false 
}: HeaderProps) => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src="/deepseek-logo.png" 
            alt="DeepSeek AI" 
            style={{ height: 40, marginRight: 12 }}
            onError={(e) => {
              // 如果图片加载失败，使用文字代替
              e.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="h6" component="div" sx={{ color: '#333' }}>
            DeepSeek AI 聊天助手
          </Typography>
        </Box>

        {onNewChatClick && (
          <Tooltip title="新建对话">
            <IconButton 
              color="primary" 
              onClick={onNewChatClick}
              sx={{ mr: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}

        {hasHistory && onHistoryClick && (
          <Tooltip title="聊天历史">
            <IconButton 
              color="inherit" 
              onClick={onHistoryClick}
              sx={{ color: '#555', mr: 1 }}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        )}
        
        <Button 
          color="inherit" 
          onClick={onSettingsClick}
          sx={{ color: '#555' }}
          startIcon={<SettingsIcon />}
        >
          {apiKey ? "设置" : "设置 API 密钥"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 