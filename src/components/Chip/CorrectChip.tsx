import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Stack, Tooltip, Typography } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

export default function CorrectChip({ correctCount }: { correctCount: number }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Tooltip title={`正确答案数`}>
        <CheckCircleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Tooltip>
      <Tooltip title={correctCount >= 1000 ? `${correctCount}` : ''} placement="bottom-start">
        <Typography
          variant="caption"
          // variant="body2"
          align="right"
          sx={{ color: 'text.secondary' }}
        >
          {formatNumberShort(correctCount ?? 0)}
        </Typography>
      </Tooltip>
    </Stack>
  );
}
