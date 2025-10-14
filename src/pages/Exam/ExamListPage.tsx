import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Exam } from '@/api/dto';
import BannerBox from '@/components/BannerBox';
import ExamFilter from '@/components/ExamFilter';
import PageContainer from '@/components/PageContainer';
import { ExamSortType } from '@/util/enum';
import { mockExamData } from '@/util/mock';

export default function ExamListPage() {
  const examList: Exam[] = mockExamData;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ExamSortType>(ExamSortType.DEFAULT);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 排序和过滤
  let filteredExams = examList.filter(
    (exam) =>
      selectedTags.length === 0 &&
      (selectedCategories.length === 0 ||
        (Array.isArray(exam.categories)
          ? exam.categories.some((cat) => selectedCategories.includes(cat))
          : false)) &&
      (search ? exam.title.includes(search) || exam.description?.includes(search) : true) &&
      (difficulty ? exam.difficulty === difficulty : true),
  );

  if (sortBy !== 'default') {
    filteredExams = [...filteredExams].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      if (sortBy === 'difficulty') cmp = (a.difficulty || '').localeCompare(b.difficulty || '');
      return sortAsc ? cmp : -cmp;
    });
  }

  return (
    <PageContainer>
      <BannerBox title={'测验列表'} subtitle={'查找并参与你感兴趣的测验，提升你的知识水平！'} />
      <ExamFilter
        examList={examList}
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
      {/* Exam 列表 */}
      <Grid container spacing={3}>
        {filteredExams.map((exam) => (
          <Card key={exam.id}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {exam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {exam.description}
              </Typography>
              <Box>
                {exam.categories?.map((cat) => (
                  <Chip key={cat} label={cat} color="secondary" size="small" sx={{ mr: 0.5 }} />
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={exam.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
              </Box>
              <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                题目数量: {exam.questions.length}
                {exam.time_limit && ` | 时间限制: ${exam.time_limit}秒`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={Link} to={`/exams/${exam.id}`} variant="contained" size="small">
                  查看详情
                </Button>
                <Button
                  component={Link}
                  to={`/exams/${exam.id}/play`}
                  variant="outlined"
                  size="small"
                >
                  开始考试
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {filteredExams.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            暂无符合条件的考试
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
}
