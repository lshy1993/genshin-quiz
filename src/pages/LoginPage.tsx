import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postLoginUser, postRegisterUser } from '@/api/genshinQuizAPI';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const loginSchema = z.object({
  email: z.email({ message: '邮箱格式不正确' }).min(1, { message: '请输入邮箱' }),
  password: z.string().min(6, { message: '密码至少6位' }),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, { message: '请确认密码' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'],
  });

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const { currentLanguage } = useLanguage();

  // 已登录自动跳转
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    language: currentLanguage, // 注册时选择最合适的语言
  });

  // 监听语言变化，自动更新表单语言设置
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      language: currentLanguage,
    }));
  }, [currentLanguage]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success',
  });

  const showSnackbar = (message: string, severity: 'error' | 'success' = 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // validation errors
  const { emailError, passwordError, confirmPasswordError, isValid } = useMemo(() => {
    const activeSchema = tab === 0 ? loginSchema : registerSchema;
    const result = activeSchema.safeParse(formData);

    return {
      emailError: result.error?.issues.find((i) => i.path[0] === 'email')?.message,
      passwordError: result.error?.issues.find((i) => i.path[0] === 'password')?.message,
      confirmPasswordError: result.error?.issues.find((i) => i.path[0] === 'confirmPassword')
        ?.message,
      isValid: !result.error,
    };
  }, [formData, tab]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    if (tab === 0) {
      // 登录
      postLoginUser({ email: formData.email, password: formData.password })
        .then((res) => {
          login(res.token); // 只传递token，用户信息从API获取
          navigate('/home'); // 登录成功后跳转到首页
        })
        .catch((err) => {
          console.error('登录失败:', err);
          showSnackbar('登录失败，请检查邮箱和密码');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 注册
      postRegisterUser(formData)
        .then((res) => {
          login(res.token); // 只传递token，用户信息从API获取
          navigate('/home'); // 注册成功后跳转到首页
        })
        .catch((err) => {
          console.error('注册失败:', err);
          showSnackbar('注册失败，请检查输入信息');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="登录" />
            <Tab label="注册" />
          </Tabs>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              {tab === 0 ? '邮箱登录' : '邮箱注册'}
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoFocus
              required
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!passwordError}
              helperText={passwordError}
            />
            {tab === 1 && (
              <TextField
                margin="normal"
                fullWidth
                label="确认密码"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
              />
            )}
            <Button
              sx={{ mt: 2 }}
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || loading}
            >
              {loading ? '处理中...' : tab === 0 ? '登录' : '注册'}
            </Button>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
