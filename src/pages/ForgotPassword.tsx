import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { postForgotPassword } from '@/api/genshinQuizAPI';
import { routes } from '@/route/route';
import { forgotPasswordSchema } from '@/util/zod';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 表单状态
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false); // 💡 记录输入框是否交互过，防止一进页面就变红

  // 请求交互状态
  const [loading, setLoading] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  // 2. 实时计算校验结果
  const { emailError, isValid } = useMemo(() => {
    const result = forgotPasswordSchema.safeParse({ email });
    return {
      emailError: result.error?.issues.find((i) => i.path[0] === 'email')?.message,
      isValid: !result.error,
    };
  }, [email]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid) return; // 校验不通过直接拦截

    setLoading(true);

    postForgotPassword({ email })
      .then(() => {
        setIsSentSuccess(true);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t('forgotPassword.failed', '发送失败，请稍后重试');
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBackToLogin = () => {
    navigate(routes.login());
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
        {isSentSuccess ? (
          <>
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('forgotPassword.successTitle', '邮件已发送')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t(
                'forgotPassword.successDesc',
                '我们已向您的邮箱发送了重置密码的链接，请检查您的收件箱（包括垃圾邮件箱）。',
              )}
            </Typography>
            <Button variant="outlined" fullWidth onClick={handleBackToLogin}>
              {t('forgotPassword.backToLogin', '返回登录')}
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" gutterBottom>
              {t('forgotPassword.title', '忘记密码？')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t(
                'forgotPassword.subtitle',
                '请输入您注册时使用的邮箱地址，我们将向您发送重置密码的链接。',
              )}
            </Typography>

            {/* 邮箱输入框（带 Zod 格式错误提示） */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('forgotPassword.email', '电子邮箱')}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setTouched(true);
              }}
              onBlur={() => setTouched(true)}
              error={touched && !!emailError}
              helperText={touched && emailError}
            />

            {/* 提交按钮（校验不通过或正在加载时禁用） */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || (touched && !isValid)}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('forgotPassword.submit', '发送重置链接')
              )}
            </Button>

            <Button fullWidth variant="text" onClick={handleBackToLogin} sx={{ mt: 1 }}>
              {t('forgotPassword.backToLogin', '返回登录')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
