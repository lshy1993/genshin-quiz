import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Stack, Tooltip, Typography } from '@mui/material';
import { getTimeStatusText } from '@/util/utils';

export default function ExpiredTimeChip({ start, end }: { start: Date; end?: Date }) {
  return (
    <Tooltip title={`${end ? end.toISOString() : ''}`} placement="bottom-start">
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography
          variant="caption"
          // variant="body2"
          align="right"
          sx={{ color: 'text.secondary' }}
        >
          {getTimeStatusText(start, end)}
        </Typography>
      </Stack>
    </Tooltip>
  );
}
