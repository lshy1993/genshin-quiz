import { Box, Typography } from '@mui/material';

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
        原神知识测验
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9 }}>
        测试你对原神世界的了解程度，参与投票，挑战限时测验
      </Typography>
    </Box>
  );
}
