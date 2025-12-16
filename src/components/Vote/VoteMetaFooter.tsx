import { Box, Stack, Typography } from '@mui/material';
import type { Vote } from '@/api/dto';
import AuthorLink from '@/components/AuthorLink';
import LikeButtons from '@/components/LikeButtons';

interface Props {
  voteInfo: Vote;
  handleLike: (likeStatus: 1 | 0 | -1) => void;
}

export default function VoteMetaFooter({ voteInfo, handleLike }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <LikeButtons
        likes={voteInfo.likes ?? 0}
        likeStatus={voteInfo.likeStatus}
        onLike={handleLike}
      />
      <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
        <AuthorLink userId={voteInfo.created_by} showAvatar />
        <Typography variant="body2" color="text.secondary">
          创建日期: {voteInfo.created_at.toLocaleString()}
        </Typography>
      </Stack>
    </Box>
  );
}
