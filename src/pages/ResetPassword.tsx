import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postResetPassword } from '@/api/genshinQuizAPI';
import { routes } from '@/route/route';
import { getPasswordStrength } from '@/util/utils';
import { resetPasswordSchema } from '@/util/zod';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // 表单状态
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 💡 显隐状态拆分
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 交互与触摸状态
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  // 密码强度计算
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // Zod 实时校验
  const { passwordError, confirmPasswordError, isValid } = useMemo(() => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    return {
      passwordError: result.error?.issues.find((i) => i.path[0] === 'password')?.message,
      confirmPasswordError: result.error?.issues.find((i) => i.path[0] === 'confirmPassword')
        ?.message,
      isValid: !result.error,
    };
  }, [password, confirmPassword]);

  // 1. 无效 Token 直接拦截
  if (!token) {
    return (
      <Box
        sx={{
          p: 3,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 480, width: '100%', textAlign: 'center', borderRadius: 2 }}
        >
          <ErrorOutlinedIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('resetPassword.invalidTitle', '链接无效')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('resetPassword.invalidToken', '缺少必要的重置令牌，请重新申请重置密码链接。')}
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate(routes.forgotPassword())}>
            {t('resetPassword.requestNewLink', '重新申请')}
          </Button>
        </Paper>
      </Box>
    );
  }

  // 2. 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (!isValid) return;

    setLoading(true);

    postResetPassword({ token, password })
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t('resetPassword.failed', '密码重置失败，链接可能已过期');
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        {/* 3.1 成功状态 */}
        {isSuccess ? (
          <>
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('resetPassword.successTitle', '密码重置成功！')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('resetPassword.successDesc', '您的新密码已生效，请使用新密码重新登录。')}
            </Typography>
            <Button variant="contained" fullWidth onClick={() => navigate(routes.login())}>
              {t('resetPassword.goToLogin', '前往登录')}
            </Button>
          </>
        ) : (
          /* 3.2 重置密码表单 */
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" gutterBottom>
              {t('resetPassword.title', '重置您的密码')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('resetPassword.subtitle', '请输入您设置的新密码')}
            </Typography>
            {/* 新密码输入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('resetPassword.newPassword', '新密码')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setTouched((prev) => ({ ...prev, password: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              error={touched.password && !!passwordError}
              helperText={touched.password && passwordError}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 💡 密码强度可视化条 */}
            {password.length > 0 && (
              <Box sx={{ mt: 1, mb: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('resetPassword.strength', '密码强度')}
                  </Typography>
                  <Typography variant="caption" color={`${strength.color}.main`}>
                    {strength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={strength.score}
                  color={strength.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            {/* 确认新密码输入框 */}
            <TextField
              margin="normal"
              required
              fullWidth
              label={t('resetPassword.confirmPassword', '确认新密码')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setTouched((prev) => ({ ...prev, confirmPassword: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
              error={touched.confirmPassword && !!confirmPasswordError}
              helperText={touched.confirmPassword && confirmPasswordError}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 提交按钮 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || (touched.password && !isValid)}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('resetPassword.submit', '确认重置')
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
