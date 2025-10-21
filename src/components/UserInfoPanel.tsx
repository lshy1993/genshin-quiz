import { Add as AddIcon } from '@mui/icons-material';
import { Button, Divider, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface Props {
  setOpen: (open: boolean) => void;
}

export default function UserInfoPanel({ setOpen }: Props) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleCreateQuestion = () => {
    navigate('/questions/create');
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/home'); // 登出后跳转到首页
  };

  return (
    <Paper
      sx={{
        mt: 1,
        minWidth: 180,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Stack spacing={0}>
        <Button
          onClick={handleCreateQuestion}
          startIcon={<AddIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: 0,
            color: 'text.primary',
          }}
        >
          创建题目
        </Button>
        <Divider />
        <Button
          onClick={handleLogout}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: 0,
            color: 'text.primary',
          }}
        >
          退出登录
        </Button>
      </Stack>
    </Paper>
  );
}
