import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Stack, Tooltip, Typography } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

export default function VotesChip({ votes }: { votes: number }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Tooltip title="总票数">
        <HowToVoteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Tooltip>
      <Tooltip title={votes >= 1000 ? `${votes}` : ''} placement="bottom-start">
        <Typography
          variant="caption"
          // variant="body2"
          align="right"
          sx={{ color: 'text.secondary' }}
        >
          {formatNumberShort(votes)}
        </Typography>
      </Tooltip>
    </Stack>
  );
}
