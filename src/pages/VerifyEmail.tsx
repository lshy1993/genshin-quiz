import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { postVerifyEmail } from '@/api/genshinQuizAPI';

type VerifyState = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMessage(t('verifyEmail.invalidToken', '无效或缺失的验证令牌'));
      return;
    }

    // 调用后端 API 核销 Token
    const verifyToken = () => {
      postVerifyEmail({ token })
        .then(() => {
          setState('success');
        })
        .catch((err) => {
          console.log(err);
          setState('error');
          setErrorMessage(err.message);
        });
    };

    verifyToken();
  }, [token, t]);

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
        {/* 1. 加载中状态 */}
        {state === 'loading' && (
          <>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="h6">
              {t('verifyEmail.verifying', '正在验证您的邮箱...')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('verifyEmail.pleaseWait', '请稍等片刻')}
            </Typography>
          </>
        )}

        {/* 2. 验证成功状态 */}
        {state === 'success' && (
          <>
            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('verifyEmail.successTitle', '邮箱验证成功！')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('verifyEmail.successDesc', '您的邮箱已成功激活，现在可以正常使用所有功能了。')}
            </Typography>
          </>
        )}

        {/* 3. 验证失败状态 */}
        {state === 'error' && (
          <>
            <ErrorOutlinedIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('verifyEmail.errorTitle', '验证失败')}
            </Typography>
            <Typography variant="body2" color="error.main" sx={{ mb: 3 }}>
              {errorMessage}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}
