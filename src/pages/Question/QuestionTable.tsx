import {
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

interface Question {
  id: string; // uuid string
  question_text: string;
  category: string;
  difficulty: string;
  answerCount: number;
  correctRate: number;
  question_type: string;
  availableLanguages: string[];
}

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
              <TableCell align="right">
                <Tooltip title={`${Math.round(question.correctRate * 100)}%`} arrow>
                  <span>
                    <LinearProgress
                      variant="determinate"
                      value={question.correctRate * 100}
                      sx={{ height: 6, borderRadius: 3, width: 60 }}
                      color={
                        question.correctRate > 0.7
                          ? 'success'
                          : question.correctRate > 0.5
                            ? 'warning'
                            : 'error'
                      }
                    />
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {question.answerCount.toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
