import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material';
import type { Question } from '@/api/dto';
import { formatNumberShort } from '@/util/utils';

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
      <ButtonGroup size="small" sx={{ height: 32 }}>
        <Button
          size="small"
          color="inherit"
          variant="text"
          startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
          onClick={() => handleLike(question.likeStatus === 1 ? 0 : 1)}
          sx={{
            px: 1.5,
            bgcolor: question.likeStatus === 1 ? 'primary.main' : undefined,
            color: question.likeStatus === 1 ? '#fff' : undefined,
            '&:hover': {
              bgcolor: question.likeStatus === 1 ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          {formatNumberShort(question.likes ?? 0)}
        </Button>
        <Button
          size="small"
          color="inherit"
          variant="text"
          onClick={() => handleLike(question.likeStatus === -1 ? 0 : -1)}
          sx={{
            px: 1.5,
            bgcolor: question.likeStatus === -1 ? 'grey.700' : undefined,
            color: question.likeStatus === -1 ? '#fff' : undefined,
            '&:hover': {
              bgcolor: question.likeStatus === -1 ? 'grey.800' : 'action.hover',
            },
          }}
        >
          <ThumbDownAltOutlinedIcon fontSize="small" />
        </Button>
      </ButtonGroup>
      <Button
        size="small"
        color="primary"
        variant={'text'}
        startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
        disabled
      >
        {question.likes ?? 0}
      </Button>
      <Stack spacing={0.5} sx={{ flex: 1, textAlign: 'right' }}>
        <Typography variant="body2" color="text.secondary">
          作者: {question.created_by}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          创建日期: {question.created_at.toDateString()}
        </Typography>{' '}
      </Stack>
    </Box>
  );
}
