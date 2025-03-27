import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography,
  Alert
} from '@mui/material';

interface APIKeyModalProps {
  open: boolean;
  apiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

const APIKeyModal = ({ open, apiKey, onSave, onClose }: APIKeyModalProps) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey, open]);

  const handleSave = () => {
    if (!key.trim()) {
      setError('请输入API密钥');
      return;
    }
    
    setError('');
    onSave(key.trim());
  };

  return (
    <Dialog open={open} onClose={apiKey ? onClose : undefined} fullWidth maxWidth="sm">
      <DialogTitle>API 设置</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          请输入您的 DeepSeek API 密钥，用于与 DeepSeek API 通信。
          您的API密钥将只存储在浏览器本地，不会发送到任何第三方服务器。
        </Typography>
        
        <TextField
          label="DeepSeek API 密钥"
          type="password"
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
          variant="outlined"
          margin="normal"
          autoFocus
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        {apiKey && (
          <Button onClick={onClose} color="secondary">
            取消
          </Button>
        )}
        <Button onClick={handleSave} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIKeyModal; 