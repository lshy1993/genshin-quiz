import { Box, Button, Container, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postLoginUser, postRegisterUser } from '@/api/genshinQuizAPI';
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
  const { login } = useUser();

  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

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
          login(res.token, res.user);
          navigate('/home'); // 登录成功后跳转到首页
        })
        .catch((err) => {
          console.error(err);
          alert(`登录失败: ${err.message || JSON.stringify(err)}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 注册
      postRegisterUser(formData)
        .then((res) => {
          login(res.token, res.user);
          navigate('/home'); // 注册成功后跳转到首页
        })
        .catch((err) => {
          console.error(err);
          alert(`注册失败: ${err.message || JSON.stringify(err)}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
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
  );
}
