import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Stack, Tooltip, Typography } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

export default function UsersChip({ participants }: { participants: number }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Tooltip title="总参与人数">
        <PeopleAltIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Tooltip>
      <Tooltip title={participants >= 1000 ? `${participants}` : ''} placement="bottom-start">
        <Typography
          variant="caption"
          // variant="body2"
          align="right"
          sx={{ color: 'text.secondary' }}
        >
          {formatNumberShort(participants)}
        </Typography>
      </Tooltip>
    </Stack>
  );
}
