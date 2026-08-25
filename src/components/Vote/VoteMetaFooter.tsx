import { Box, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import type { LikeStatus, Poll } from '@/api/dto';
import AuthorLink from '@/components/AuthorLink';
import LikeButtons from '@/components/Button/LikeButtons';

interface Props {
  voteInfo: Poll;
  handleLike: (likeStatus: LikeStatus) => void;
}

export default function VoteMetaFooter({ voteInfo, handleLike }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <LikeButtons
        likes={voteInfo.likes_count}
        likeStatus={voteInfo.like_status}
        onLike={handleLike}
      />
      <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
        <AuthorLink userId={voteInfo.created_by} showAvatar />
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {t('vote.created_at', { time: voteInfo.created_at.toLocaleString() })}
        </Typography>
      </Stack>
    </Box>
  );
}
