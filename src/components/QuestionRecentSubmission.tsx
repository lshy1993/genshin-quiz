import { Box, Divider, Typography } from '@mui/material';
import type { QuestionSubmission } from '@/util/mock';

interface Props {
  recentSubmissions: QuestionSubmission[];
}

export default function QuestionRecentSubmission({ recentSubmissions }: Props) {
  /* 其他用户答题情况 */
  return (
    <Box>
      <Divider sx={{ my: 1 }} />
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
