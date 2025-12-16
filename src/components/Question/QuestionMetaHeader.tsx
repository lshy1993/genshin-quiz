import { Box, Chip, Typography } from '@mui/material';
import type { Question } from '@/api/dto';
import CategoryChip from '@/components/CategoryChip';
import { getCorrectRate, getDifficultyColor, getDifficultyLabel } from '@/util/utils';

interface Props {
  question: Question;
}

export default function QuestionMetaHeader({ question }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
        <CategoryChip category={question.category} size="medium" />
        <Chip
          size="medium"
          label={getDifficultyLabel(question.difficulty)}
          color={getDifficultyColor(question.difficulty)}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant="body2" color="text.secondary">
          正确次数: {question.correct_count}/{question.answer_count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          正确率: {getCorrectRate(question, 1)}%
        </Typography>
      </Box>
    </Box>
  );
}
