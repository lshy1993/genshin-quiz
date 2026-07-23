import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import CategoryChip from '@/components/Chip/CategoryChip';
import {
  formatNumberShort,
  getCorrectRate,
  getDifficultyColor,
  getDifficultyLabel,
} from '@/util/utils';

interface QuestionTableProps {
  questions: Question[];
}

export default function QuestionTable({ questions }: QuestionTableProps) {
  const navigate = useNavigate();

  const renderCorrectRate = (question: Question) => {
    const rate = getCorrectRate(question);
    return (
      <Tooltip title={`${rate}%`} arrow>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <LinearProgress
            sx={{ height: 8, borderRadius: 4, width: 60 }}
            variant="determinate"
            value={rate}
            color={rate > 70 ? 'success' : rate > 50 ? 'warning' : 'error'}
          />
        </Box>
      </Tooltip>
    );
  };

  const renderSolvedNumber = (count: number) => {
    return (
      <Tooltip title={count >= 1000 ? count : ''} arrow placement="bottom-end">
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {formatNumberShort(count)}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  if (questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
          }}
        >
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
            <TableCell align="center" sx={{ width: 10 }}></TableCell>
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
              <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                {question.solved && (
                  <Tooltip title="你已答对此题">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </Box>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <CategoryChip category={question.category} />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {question.question_text}
                </Typography>
              </TableCell>
              <TableCell align="right">{renderCorrectRate(question)}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" color={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Typography>
              </TableCell>
              <TableCell align="right">{renderSolvedNumber(question.answer_count ?? 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
