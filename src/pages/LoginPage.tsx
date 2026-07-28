import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLoginUser, postRegisterUser } from '@/api/genshinQuizAPI';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { routes } from '@/route/route';
import { loginSchema, registerSchema } from '@/util/zod';

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const { currentLanguage } = useLanguage();

  // 已登录自动跳转
  useEffect(() => {
    if (user) {
      navigate(routes.home(), { replace: true });
    }
  }, [user, navigate]);

  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // 💡 密码显隐控制
  const [touched, setTouched] = useState<Record<string, boolean>>({}); // 💡 记录输入框是否被操作过，防止一进来就变红

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    language: currentLanguage,
  });

  // 监听语言变化，自动更新表单语言设置
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      language: currentLanguage,
    }));
  }, [currentLanguage]);

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
    setTouched({}); // 切换 Tab 时重置校验状态
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    if (tab === 0) {
      // 登录
      postLoginUser({ email: formData.email, password: formData.password })
        .then((res) => {
          login(res.token);
          navigate(routes.home());
        })
        .catch((err) => {
          console.error('登录失败:', err);
          enqueueSnackbar('登录失败，请检查邮箱和密码', {
            variant: 'error',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // 注册
      postRegisterUser(formData)
        .then((res) => {
          login(res.token);
          navigate(routes.home());
        })
        .catch((err) => {
          console.error('注册失败:', err);
          enqueueSnackbar('注册失败，请检查输入信息', {
            variant: 'error',
          });
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

          {/* 邮箱 */}
          <TextField
            margin="normal"
            fullWidth
            label="邮箱"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            required
            error={touched.email && !!emailError}
            helperText={touched.email && emailError}
          />

          {/* 密码（带显示/隐藏切换按钮） */}
          <TextField
            margin="normal"
            fullWidth
            label="密码"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.password && !!passwordError}
            helperText={touched.password && passwordError}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 确认密码（仅注册时显示） */}
          {tab === 1 && (
            <TextField
              margin="normal"
              fullWidth
              label="确认密码"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.confirmPassword && !!confirmPasswordError}
              helperText={touched.confirmPassword && confirmPasswordError}
            />
          )}

          {/* 💡 登录状态下显示的“忘记密码”链接 */}
          {tab === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate(routes.forgotPassword())}
                sx={{ textDecoration: 'none' }}
              >
                忘记密码？
              </Link>
            </Box>
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
