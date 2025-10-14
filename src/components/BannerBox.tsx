import { Box, Typography } from '@mui/material';

interface BannerBoxProps {
  title: string;
  subtitle: string;
}

export default function BannerBox({ title, subtitle }: BannerBoxProps) {
  return (
    <Box
      sx={{
        p: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="subtitle1">{subtitle}</Typography>
    </Box>
  );
}
