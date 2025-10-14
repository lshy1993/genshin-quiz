import {
  Box,
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
import { useNavigate } from 'react-router-dom';
import type { Question } from '@/api/dto';
import {
  formatCount,
  getCategoryLabel,
  getDifficultyColor,
  getDifficultyLabel,
} from '@/util/utils';

interface QuestionTableProps {
  questions: Question[];
}

export default function QuestionTable({ questions }: QuestionTableProps) {
  const navigate = useNavigate();

  const getCorrectRate = (q: Question): number => {
    if (!q.answer_count || !q.correct_count) return 0;
    if (q.answer_count === 0) return 0;
    return q.correct_count / q.answer_count;
  };

  const renderCorrectRate = (question: Question) => {
    const rate = getCorrectRate(question);
    return (
      <Tooltip title={`${(rate * 100).toFixed(1)}%`} arrow>
        <TableCell align="right">
          <LinearProgress
            sx={{ height: 8, borderRadius: 4, width: 60 }}
            variant="determinate"
            value={rate * 100}
            color={rate > 0.7 ? 'success' : rate > 0.5 ? 'warning' : 'error'}
          />
        </TableCell>
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
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 80 }}>分类</TableCell>
            <TableCell sx={{ minWidth: 200 }}>题目内容</TableCell>
            <TableCell align="right" sx={{ width: 60 }}>
              正确率
            </TableCell>
            <TableCell align="right" sx={{ width: 60 }}>
              难度
            </TableCell>
            <TableCell align="right" sx={{ width: 60 }}>
              回答人次
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              hover
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => {
                navigate(`/questions/${question.id}`);
              }}
            >
              <TableCell>
                <Typography variant="body2">{getCategoryLabel(question.category)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {question.question_text.length > 60
                    ? `${question.question_text.substring(0, 60)}...`
                    : question.question_text}
                </Typography>
              </TableCell>
              {renderCorrectRate(question)}
              <TableCell align="right">
                <Typography variant="body2" color={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip
                  title={(question.answer_count ?? 0).toLocaleString()}
                  arrow
                  placement="bottom-end"
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatCount(question.answer_count ?? 0)}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
