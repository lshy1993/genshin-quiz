import { Box, Typography } from '@mui/material';

const buildVersion = import.meta.env.VITE_BUILD_VERSION || 'development';

function BuildVersionFooter() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © moelink
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(0, 0, 0, 0.08)',
          '&::selection': {
            color: 'text.primary',
            backgroundColor: 'action.selected',
          },
        }}
      >
        build {buildVersion}
      </Typography>
    </Box>
  );
}

export default BuildVersionFooter;
