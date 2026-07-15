import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Question } from '@/api/dto';
import CategoryChip from '@/components/CategoryChip';
import { formatNumberShort, getDifficultyColor, getDifficultyLabel } from '@/util/utils';

interface QuestionPreviewCardProps {
  question: Question;
  linkTo?: string;
  actionLabel?: string;
  showLikes?: boolean;
  titleVariant?: 'h6' | 'body1';
  cardVariant?: 'elevation' | 'outlined';
  fullHeight?: boolean;
}

export default function QuestionPreviewCard({
  question,
  linkTo,
  actionLabel,
  showLikes = false,
  titleVariant = 'h6',
  cardVariant = 'elevation',
  fullHeight = true,
}: QuestionPreviewCardProps) {
  const targetTo = linkTo ?? `/questions/${question.id}`;

  return (
    <Card
      variant={cardVariant}
      sx={fullHeight ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}
    >
      <CardActionArea component={Link} to={targetTo} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant={titleVariant} component="h3" gutterBottom>
            {question.question_text}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            <CategoryChip category={question.category} />
            <Chip
              label={getDifficultyLabel(question.difficulty)}
              size="small"
              color={getDifficultyColor(question.difficulty)}
            />
            {showLikes && typeof question.likes === 'number' && (
              <Chip
                icon={<ThumbUpIcon fontSize="small" />}
                label={formatNumberShort(question.likes)}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
      {actionLabel && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button component={Link} to={targetTo} variant="contained" size="small" fullWidth>
            {actionLabel}
          </Button>
        </Box>
      )}
    </Card>
  );
}
