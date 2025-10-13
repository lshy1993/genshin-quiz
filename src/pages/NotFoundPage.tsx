import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        {t('404.title_not_found')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('404.label_not_found')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          {t('404.btn_label.home')}
        </Button>
        <Button variant="outlined" size="large" onClick={() => navigate('/quizzes')}>
          {t('404.btn_label.quizzes')}
        </Button>
      </Box>
    </Box>
  );
}
