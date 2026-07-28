import { Box, Divider, LinearProgress, Typography } from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedText } from '@/util/utils';

interface Props {
  options: QuestionOption[];
}

export default function QuestionStatistics({ options }: Props) {
  const { currentLanguage } = useLanguage();

  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2">选项统计</Typography>
      {options.map((option) => (
        <Box key={option.id} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {getLocalizedText(option.text, currentLanguage)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={option.selected_count ? option.selected_count * 2 : 0}
            sx={{ height: 10, borderRadius: 1 }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            {option.selected_count}票
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
