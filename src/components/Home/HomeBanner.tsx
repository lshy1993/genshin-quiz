import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

export default function HomeBanner() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 2,
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'primary.contrastText',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('home.banner_title')}
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9 }}>
        {t('home.banner_subtitle')}
      </Typography>
    </Box>
  );
}
