import { Box, Button, Container, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import type React from 'react';
import { useState } from 'react';

const AuthForm: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 登录逻辑
    alert(`登录: ${JSON.stringify(loginData)}`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 注册逻辑
    alert(`注册: ${JSON.stringify(registerData)}`);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="登录" />
          <Tab label="注册" />
        </Tabs>
        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              邮箱登录
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
              autoFocus
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              登录
            </Button>
          </Box>
        )}
        {tab === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              邮箱注册
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="确认密码"
              name="confirmPassword"
              type="password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              注册
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AuthForm;
