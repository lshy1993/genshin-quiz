import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import QuestionFilter from '@/components/QuestionFilter';
import { mockQuestionData } from '@/util/mock';
// import { useGetQuestions } from '@/api/genshinQuizAPI';

export default function QuestionListPage() {
  // const { data: questions, isLoading, error } = useGetQuestions();
  // const questionList = questions?.questions || [];
  const questionList = mockQuestionData;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    'default' | 'difficulty' | 'category' | 'answerCount' | 'correctRate'
  >('default');
  const [sortAsc, setSortAsc] = useState(true);

  // 排序和过滤
  let filteredQuestions = questionList.filter(
    (question) =>
      (selectedCategories.length === 0 || selectedCategories.includes(question.category)) &&
      (selectedQuestionTypes.length === 0 ||
        selectedQuestionTypes.includes(question.question_type)) &&
      (search ? question.question_text.includes(search) : true) &&
      (difficulty ? question.difficulty === difficulty : true),
  );

  if (sortBy !== 'default') {
    filteredQuestions = [...filteredQuestions].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        cmp =
          (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) -
          (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
      }
      if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      if (sortBy === 'answerCount') cmp = a.answerCount - b.answerCount;
      if (sortBy === 'correctRate') cmp = a.correctRate - b.correctRate;
      return sortAsc ? cmp : -cmp;
    });
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lore':
        return '剧情背景';
      case 'characters':
        return '角色';
      case 'gameplay':
        return '游戏玩法';
      case 'items':
        return '物品道具';
      case 'events':
        return '活动';
      default:
        return category;
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return diff;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return '单选题';
      case 'true_false':
        return '判断题';
      case 'fill_in_blank':
        return '填空题';
      default:
        return type;
    }
  };

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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      {/* Banner */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          题目列表
        </Typography>
        <Typography variant="subtitle1">浏览所有题目，点击查看详情并开始答题！</Typography>
      </Box>

      {/* 筛选区 */}
      <QuestionFilter
        questionList={questionList}
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />

      {/* 题目表格 */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>题目内容</TableCell>
              <TableCell align="center">分类</TableCell>
              <TableCell align="center">难度</TableCell>
              <TableCell align="center">题型</TableCell>
              <TableCell align="center">回答人次</TableCell>
              <TableCell align="center">正确率</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.map((question) => (
              <TableRow key={question.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {question.question_text.length > 50
                      ? `${question.question_text.substring(0, 50)}...`
                      : question.question_text}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getCategoryLabel(question.category)}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getDifficultyLabel(question.difficulty)}
                    color={getDifficultyColor(question.difficulty)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getQuestionTypeLabel(question.question_type)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{question.answerCount.toLocaleString()}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ width: 80, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={question.correctRate * 100}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                      color={
                        question.correctRate > 0.7
                          ? 'success'
                          : question.correctRate > 0.5
                            ? 'warning'
                            : 'error'
                      }
                    />
                    <Typography variant="caption" sx={{ minWidth: 35 }}>
                      {Math.round(question.correctRate * 100)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    component={Link}
                    to={`/questions/${question.id}`}
                    variant="contained"
                    size="small"
                  >
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredQuestions.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            暂无符合条件的题目
          </Typography>
        </Box>
      )}
    </Box>
  );
}
