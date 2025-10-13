import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Quiz } from '@/api/dto';
import ExamFilter from '@/components/ExamFilter';
import { mockQuizData } from '@/util/mock';
// import { useGetQuizzes } from '@/api/genshinQuizAPI';

export default function ExamListPage() {
  // const { data: quizzes, isLoading, error } = useGetQuizzes();
  // const quizList: Quiz[] = quizzes?.quizzes || [];
  const quizList: Quiz[] = mockQuizData;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'difficulty'>('default');
  const [sortAsc, setSortAsc] = useState(true);

  // 排序和过滤
  let filteredQuizzes = quizList.filter(
    (quiz) =>
      selectedTags.length === 0 &&
      (selectedCategories.length === 0 || selectedCategories.includes(quiz.category)) &&
      (search ? quiz.title.includes(search) || quiz.description?.includes(search) : true) &&
      (difficulty ? quiz.difficulty === difficulty : true),
  );

  if (sortBy !== 'default') {
    filteredQuizzes = [...filteredQuizzes].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') cmp = (a.difficulty || '').localeCompare(b.difficulty || '');
      return sortAsc ? cmp : -cmp;
    });
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
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
          考试列表
        </Typography>
        <Typography variant="subtitle1">查找并参与你感兴趣的考试，提升你的知识水平！</Typography>
      </Box>

      {/* 筛选区 */}
      <ExamFilter
        examList={quizList}
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />

      {/* Quiz 列表 */}
      <Grid container spacing={3}>
        {filteredQuizzes.map((quiz) => (
          <Grid item xs={12} md={6} lg={4} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {quiz.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={quiz.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
                  <Chip label={quiz.category} color="secondary" size="small" />
                </Box>
                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                  题目数量: {quiz.questions.length}
                  {quiz.time_limit && ` | 时间限制: ${quiz.time_limit}秒`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/exams/${quiz.id}`}
                    variant="contained"
                    size="small"
                  >
                    查看详情
                  </Button>
                  <Button
                    component={Link}
                    to={`/exams/${quiz.id}/play`}
                    variant="outlined"
                    size="small"
                  >
                    开始考试
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredQuizzes.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            暂无符合条件的考试
          </Typography>
        </Box>
      )}
    </Box>
  );
}
