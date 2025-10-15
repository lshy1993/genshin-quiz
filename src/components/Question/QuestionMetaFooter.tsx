import { Box, Typography } from '@mui/material';
import type { Question } from '@/api/dto';

interface Props {
  question: Question;
}

export default function QuestionMetaFooter({ question }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        作者: {question.created_by}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        创建日期: {question.created_at.toDateString()}
      </Typography>
    </Box>
  );
}
