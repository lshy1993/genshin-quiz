import { Box, Typography } from '@mui/material';
import { mockRecentQuestionSubmissions } from '@/util/mock';

interface Props {
  questionId: string;
}

export default function QuestionRecentSubmission({ questionId }: Props) {
  // 从真实服务器获取数据
  // const { data } = useGetRecentSubmissions(questionId);
  // 临时mock其他用户提交数据
  const recentSubmissions = mockRecentQuestionSubmissions;
  /* 其他用户答题情况 */
  return (
    <Box>
      <Typography variant="subtitle2">其他用户答题情况</Typography>
      {recentSubmissions.map((item) => (
        <Typography
          key={item.user_name}
          variant="body2"
          color={item.correct ? 'success.main' : 'error.main'}
        >
          {item.user_name} {item.correct ? '答对了' : '答错了'}
        </Typography>
      ))}
    </Box>
  );
}
