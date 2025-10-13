import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import type { Exam } from '../api/dto';
import { useGetExams } from '../api/genshinQuizAPI';

export default function HomePage() {
  const { data: examRes, isLoading, error } = useGetExams();

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    console.error('Error fetching quizzes:', error);
    return (
      <Alert severity="error">
        <Typography color="error">{t('common.loading_failed')}</Typography>
      </Alert>
    );
  }

  const featuredExams: Exam[] = examRes?.exams?.slice(0, 3) || [];

  return (
    <>
      {/* 欢迎区域 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          原神知识测验
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          测试你对原神世界的了解程度
        </Typography>
        <Button component={Link} to="/questions" variant="contained" size="large" sx={{ mr: 2 }}>
          浏览题目
        </Button>
        <Button component={Link} to="/about" variant="outlined" size="large">
          了解更多
        </Button>
      </Box>
      {/* 精选测验 */}
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        精选测验
      </Typography>
      <Grid container spacing={3}>
        {featuredExams.map((exam) => (
          <Grid item xs={12} md={4} key={exam.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {exam.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {exam.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                  难度: {exam.difficulty}
                </Typography>
                <Box>
                  {exam.categories?.map((cat) => (
                    <Chip key={cat} label={cat} color="secondary" size="small" sx={{ mr: 0.5 }} />
                  ))}
                </Box>
                <Button
                  component={Link}
                  to={`/questions/${exam.id}`}
                  variant="contained"
                  size="small"
                >
                  开始答题
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
