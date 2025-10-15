import { Box, Stack, Typography } from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import type { QuestionSubmission } from '@/util/mock';

interface Props {
  submissionList: QuestionSubmission[];
  options: QuestionOption[];
}

export default function QuestionMySubmission({ submissionList, options }: Props) {
  return (
    <Box>
      <Typography variant="subtitle2">我的提交记录</Typography>
      {submissionList.map((sub, idx) => (
        <Stack key={sub.submitted_at.toISO()} direction="row" spacing={1}>
          <Typography variant="body2">{idx + 1}</Typography>
          <Typography variant="body2" color={sub.correct ? 'success.main' : 'error.main'}>
            {sub.correct ? '正确' : '错误'}
          </Typography>
          <Typography variant="body2" color={sub.correct ? 'success.main' : 'error.main'}>
            {sub.selected
              ?.map((id) => options.find((opt) => opt.id === id)?.text || '')
              .join('，')}{' '}
          </Typography>
          <Typography variant="body2">{sub.submitted_at.toFormat('yyyy-MM-dd HH:mm')}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
