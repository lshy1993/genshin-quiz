import { Box, Divider, LinearProgress, Typography } from '@mui/material';
import type { QuestionOption } from '@/api/dto';

interface Props {
  options: QuestionOption[];
}

export default function QuestionStatistics({ options }: Props) {
  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2">选项统计</Typography>
      {options.map((option) => (
        <Box key={option.id} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {option.text}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={option.count ? option.count * 2 : 0}
            sx={{ height: 10, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {option.count}票
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
