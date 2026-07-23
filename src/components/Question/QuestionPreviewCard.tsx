import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Question } from '@/api/dto';
import CategoryChip from '@/components/Chip/CategoryChip';
import { getDifficultyColor, getDifficultyLabel } from '@/util/utils';
import CorrectChip from '../Chip/CorrectChip';
import LikesChip from '../Chip/LikesChip';
import UsersChip from '../Chip/UsersChip';

interface QuestionPreviewCardProps {
  question: Question;
  linkTo?: string;
  actionLabel?: string;
}

export default function QuestionPreviewCard({
  question,
  linkTo,
  actionLabel,
}: QuestionPreviewCardProps) {
  const targetTo = linkTo ?? `/questions/${question.id}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box>
          <Typography component="h3">{question.question_text}</Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            <CategoryChip category={question.category} />
            <Chip
              label={getDifficultyLabel(question.difficulty)}
              size="small"
              color={getDifficultyColor(question.difficulty)}
            />
          </Stack>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <CorrectChip correctCount={question.correct_count ?? 0} />
          <UsersChip participants={question.answer_count ?? 0} />
          <LikesChip likes={question.likes ?? 0} />
        </Stack>
        {actionLabel && (
          <Button component={Link} to={targetTo} variant="contained" size="small" fullWidth>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
