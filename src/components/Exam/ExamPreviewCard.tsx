import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Exam } from '@/api/dto';
import CategoryChip from '@/components/Chip/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';
import { getDifficultyColor, getDifficultyLabel, getLocalizedText } from '@/util/utils';

interface ExamPreviewCardProps {
  exam: Exam;
  actionLabel?: string;
}

export default function ExamPreviewCard({ exam, actionLabel }: ExamPreviewCardProps) {
  const { currentLanguage } = useLanguage();
  const targetTo = `/exams/${exam.id}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {getLocalizedText(exam.title, currentLanguage)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {getLocalizedText(exam.description, currentLanguage)}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {exam.categories?.map((cat) => (
            <CategoryChip key={cat} category={cat} />
          ))}
          <Chip
            label={getDifficultyLabel(exam.difficulty)}
            size="small"
            color={getDifficultyColor(exam.difficulty)}
          />
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
