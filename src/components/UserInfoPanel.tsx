import {
  Add as AddIcon,
  Language as LanguageIcon,
  Poll as PollIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { allLanguages } from '@/util/enum';
import { getLanguageLabel } from '@/util/utils';

interface Props {
  setOpen: (open: boolean) => void;
}

export default function UserInfoPanel({ setOpen }: Props) {
  const { user, logout } = useUser();
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleCreateQuestion = () => {
    navigate('/questions/create');
    setOpen(false);
  };

  const handleCreateVote = () => {
    navigate('/votes/create');
    setOpen(false);
  };

  const handleCreateExam = () => {
    navigate('/exams/create');
    setOpen(false);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setCurrentLanguage(event.target.value);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/home'); // 登出后跳转到首页
  };

  if (!user) {
    return null;
  }

  return (
    <Paper
      sx={{
        mt: 1,
        minWidth: 220,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Stack spacing={0}>
        {/* 用户资料区域 */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={user.avatar_url}
              alt={user.nickname}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            >
              {user.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.nickname}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.country || '未知地区'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              正确率:{' '}
              {user.total_answers > 0
                ? Math.round((user.correct_answers / user.total_answers) * 100)
                : 0}
              %
            </Typography>
            <Typography variant="caption" color="text.secondary">
              题目: {user.questions_created}
            </Typography>
          </Box>
        </Box>
        {/* 创建功能按钮 */}
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
        <Button
          onClick={handleCreateVote}
          startIcon={<PollIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: 0,
            color: 'text.primary',
          }}
        >
          创建投票
        </Button>
        <Button
          onClick={handleCreateExam}
          startIcon={<QuizIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: 0,
            color: 'text.primary',
          }}
        >
          创建测验
        </Button>

        <Divider />

        {/* 语言选择 */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LanguageIcon sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" color="text.primary">
              语言设置
            </Typography>
          </Box>
          <Select
            value={currentLanguage}
            onChange={handleLanguageChange}
            size="small"
            fullWidth
            sx={{ fontSize: '0.875rem' }}
          >
            {allLanguages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {getLanguageLabel(lang)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider />

        {/* 登出按钮 */}
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
