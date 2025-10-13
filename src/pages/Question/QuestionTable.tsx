import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import type { Question } from '@/api/dto';

interface QuestionTableProps {
  questions: Question[];
}

const getCategoryLabel = (category: string) => t(`question.category.${category}`);
const getDifficultyLabel = (diff: string) => t(`question.difficulty.${diff}`);
const getDifficultyColor = (diff: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (diff) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'error';
    default:
      return 'default';
  }
};

export default function QuestionTable({ questions }: QuestionTableProps) {
  const getCorrectRate = (q: Question) => {
    if (!q.answer_count || !q.correct_count) return 0;
    if (q.answer_count === 0) return 0;
    return q.correct_count / q.answer_count;
  };

  const renderCorrectRate = (question: Question) => {
    const rate = getCorrectRate(question);
    return (
      <Tooltip title={`${Math.round(rate * 100)}%`} arrow>
        <span>
          <LinearProgress
            variant="determinate"
            value={rate * 100}
            sx={{ height: 6, borderRadius: 3, width: 60 }}
            color={rate > 0.7 ? 'success' : rate > 0.5 ? 'warning' : 'error'}
          />
        </span>
      </Tooltip>
    );
  };

  if (questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          暂无符合条件的题目
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 420 }}>题目内容</TableCell>
            <TableCell align="center" sx={{ width: 120 }}>
              分类
            </TableCell>
            <TableCell align="right" sx={{ width: 100 }}>
              正确率
            </TableCell>
            <TableCell align="right" sx={{ width: 100 }}>
              难度
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              回答人次
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              hover
              component={Link}
              to={`/questions/${question.id}`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ maxWidth: 400 }}>
                  {question.question_text.length > 60
                    ? `${question.question_text.substring(0, 60)}...`
                    : question.question_text}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip label={getCategoryLabel(question.category)} color="secondary" size="small" />
              </TableCell>
              <TableCell align="right">{renderCorrectRate(question)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" color={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {question.answer_count ?? 0}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
