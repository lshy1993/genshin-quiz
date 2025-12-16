import { Box, Typography } from '@mui/material';
import type { Vote } from '@/api/dto';
import AuthorLink from '@/components/AuthorLink';

interface Props {
  voteInfo: Vote;
}

export default function VoteMetaHeader({ voteInfo }: Props) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        开始：{voteInfo.start_at.toLocaleString()}
        截止：{voteInfo.expire_at?.toLocaleString() || '无限期'}
      </Typography>
      <AuthorLink userId={voteInfo.created_by} />
      <Typography variant="body2" color="text.secondary">
        创建时间：{voteInfo.created_at.toDateString()}
      </Typography>
    </Box>
  );
}
