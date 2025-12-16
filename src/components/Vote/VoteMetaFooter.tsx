import { Box, Stack, Typography } from '@mui/material';
import type { Vote } from '@/api/dto';
import AuthorLink from '@/components/AuthorLink';
import LikeButtons from '@/components/LikeButtons';

interface Props {
  voteInfo: Vote;
  handleLike: (likeStatus: 1 | 0 | -1) => void;
}

export default function VoteMetaFooter({ voteInfo, handleLike }: Props) {
  const renderTime = (date: Date | undefined) => {
    if (!date) return '无限期';
    return date.toLocaleString();
  };

  return (
    <Stack spacing={1}>
      <LikeButtons
        likes={voteInfo.likes ?? 0}
        likeStatus={voteInfo.likeStatus}
        onLike={handleLike}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            开始：{renderTime(voteInfo.start_at)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            截止：{renderTime(voteInfo.expire_at)}
          </Typography>
        </Stack>
        <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
          <AuthorLink userId={voteInfo.created_by} showAvatar />
          <Typography variant="body2" color="text.secondary">
            {renderTime(voteInfo.created_at)}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
