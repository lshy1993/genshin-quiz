import {
  Box,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumberShort } from '@/util/utils';

interface Props {
  options: QuestionOption[];
  solved?: boolean;
  selected: string[];
  setSelected: (selected: string[]) => void;
  disabled: boolean;
}

export default function SingleChoice({ options, solved, selected, setSelected, disabled }: Props) {
  const { currentLanguage } = useLanguage();
  const total = options.reduce((sum, opt) => sum + (opt.count ?? 0), 0);

  const renderOption = (opt: QuestionOption) => {
    const percent = total > 0 ? Math.round(((opt.count ?? 0) / total) * 100) : 0;

    return (
      <Box key={opt.id}>
        <FormControlLabel
          key={opt.id}
          value={opt.id}
          control={<Radio />}
          label={opt.text?.[currentLanguage] ?? ''}
          disabled={disabled}
        />
        {solved && (
          <Box sx={{ minWidth: 120, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`${percent}%`} placement="right" arrow>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ height: 16, flex: 1, transition: '0.5s' }}
              />
            </Tooltip>
            <Tooltip title={opt.count ?? 0} placement="bottom" arrow>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'right', minWidth: 80 }}
              >
                {`${formatNumberShort(opt.count ?? 0)} (${percent}%)`}
              </Typography>
            </Tooltip>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <RadioGroup value={selected[0] || ''} onChange={(e) => setSelected([e.target.value])}>
      {options.map((opt, _) => renderOption(opt))}
    </RadioGroup>
  );
}
