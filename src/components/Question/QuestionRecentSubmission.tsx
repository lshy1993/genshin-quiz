import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useGetQuestionRecentSubmissions } from '@/api/genshinQuizAPI';

interface Props {
  questionId: string;
}

export default function QuestionRecentSubmission({ questionId }: Props) {
  // 从真实服务器获取数据
  const {
    data: recentSubmissions,
    isLoading: isSubmissionsLoading,
    error: submissionsErr,
  } = useGetQuestionRecentSubmissions(questionId);

  if (isSubmissionsLoading) {
    return <CircularProgress />;
  }
  if (submissionsErr || !recentSubmissions) {
    console.error('Failed to load submissions:', submissionsErr);
    return <Alert severity="error">加载题目失败</Alert>;
  }

  /* 其他用户答题情况 */
  return (
    <Box>
      <Typography variant="subtitle2">其他用户答题情况</Typography>
      {recentSubmissions.map((item) => (
        <Typography
          key={item.submitted_at.toISOString()}
          variant="body2"
          color={item.is_correct ? 'success.main' : 'error.main'}
        >
          {item.user_name} {item.is_correct ? '答对了' : '答错了'}
        </Typography>
      ))}
    </Box>
  );
}
