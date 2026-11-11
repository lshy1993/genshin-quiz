import { Box, Typography } from '@mui/material';

const buildVersion = __BUILD_VERSION__;
const buildTime = new Date(__BUILD_TIME__);
const buildTimeLabel = Number.isNaN(buildTime.getTime())
  ? ''
  : `构建时间：${buildTime.toLocaleString('zh-CN', { hour12: false })}`;

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
        title={buildTimeLabel}
        sx={{
          color: 'rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.04em',
          cursor: 'default',
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
