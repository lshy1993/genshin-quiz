import { Box, Stack, Typography } from '@mui/material';
import type { Question } from '@/api/dto';
import AuthorLink from '@/components/AuthorLink';
import CommentButton from '@/components/CommentButton';
import LikeButtons from '@/components/LikeButtons';

interface Props {
  question: Question;
  handleLike: (likeStatus: 1 | 0 | -1) => void;
}

export default function QuestionMetaFooter({ question, handleLike }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <LikeButtons
        likes={question.likes ?? 0}
        likeStatus={question.likeStatus}
        onLike={handleLike}
      />
      <CommentButton count={0} disabled />
      <Stack spacing={0.5} sx={{ flex: 1, alignItems: 'flex-end' }}>
        <AuthorLink userId={question.created_by} />
        <Typography variant="body2" color="text.secondary">
          创建日期: {question.created_at.toLocaleString()}
        </Typography>
      </Stack>
    </Box>
  );
}
