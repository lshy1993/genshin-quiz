import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Stack, Tooltip, Typography } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

export default function LikesChip({ likes }: { likes: number }) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Tooltip title={`点赞数`}>
        <ThumbUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Tooltip>
      <Tooltip title={likes >= 1000 ? `${likes}` : ''} placement="bottom-start">
        <Typography
          variant="caption"
          // variant="body2"
          align="right"
          sx={{ color: 'text.secondary' }}
        >
          {formatNumberShort(likes)}
        </Typography>
      </Tooltip>
    </Stack>
  );
}
