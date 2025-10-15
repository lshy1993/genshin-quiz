import { Box, Tooltip, Typography } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

interface Props {
  yesCount: number;
  noCount: number;
}

export default function DualProgressBar({ yesCount, noCount }: Props) {
  const total = yesCount + noCount;
  const yesPercent = total > 0 ? Math.round((yesCount / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        height: 24,
        // borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <Tooltip title={yesCount} placement="bottom" arrow>
        <Box
          sx={{
            width: `${yesPercent}%`,
            height: '100%',
            bgcolor: 'success.main',
            transition: '0.5s',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="#fff">
            {`${formatNumberShort(yesCount)} (${yesPercent}%)`}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip title={noCount} arrow>
        <Box
          sx={{
            width: `${noPercent}%`,
            height: '100%',
            bgcolor: 'error.main',
            transition: '0.5s',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="#fff">
            {`${formatNumberShort(noCount)} (${noPercent}%)`}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}
