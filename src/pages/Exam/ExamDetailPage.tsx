import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useGetExam } from '../../api/genshinQuizAPI';

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: exam, error } = useGetExam(id as string);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">加载测验详情失败: {error.message}</Typography>
        <Button component={Link} to="/quizzes" sx={{ mt: 2 }}>
          返回测验列表
        </Button>
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/quizzes" sx={{ mb: 2 }}>
        ← 返回测验列表
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {exam.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {exam.description}
          </Typography>
          <Box>
            {exam.categories?.map((category) => (
              <Chip label={category} color="secondary" sx={{ mr: 1 }} />
            ))}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Chip label={exam.difficulty} color="primary" sx={{ mr: 1 }} />
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            题目数量: {exam.questions.length}
            {exam.time_limit && ` | 时间限制: ${exam.time_limit}秒`}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            创建时间: {new Date(exam.created_at).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button component={Link} to={`/exams/${exam.id}/play`} variant="contained" size="large">
          开始答题
        </Button>
        <Button component={Link} to={`/exams/${exam.id}/edit`} variant="outlined">
          编辑测验
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            题目预览
          </Typography>
          <List>
            {exam.questions.map((question, index) => (
              <ListItem key={question.order_index} divider>
                <ListItemText
                  primary={`${index + 1}. ${question.question_id}`}
                  secondary={`类型: ${question.question_id} | 分数: ${question.points || 10}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
