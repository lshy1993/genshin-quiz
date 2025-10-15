import {
  Box,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type { QuestionOption } from '@/api/dto';

interface Props {
  options: QuestionOption[];
  solved?: boolean;
  selected: string[];
  setSelected: (selected: string[]) => void;
  submitted: boolean;
}

export default function renderSingle({ options, solved, selected, setSelected, submitted }: Props) {
  return (
    <RadioGroup value={selected[0] || ''} onChange={(e) => setSelected([e.target.value])}>
      {options.map((opt, _) => (
        <Box key={opt.id}>
          <FormControlLabel
            key={opt.id}
            value={opt.id}
            control={<Radio />}
            label={opt.text || opt.image || ''}
            disabled={submitted}
          />
          {solved && (
            <Box sx={{ minWidth: 120, flex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={opt.count ? Math.min(opt.count * 2, 100) : 0}
                sx={{ height: 10, borderRadius: 1, flex: 1 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
                {opt.count ?? 0}票
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </RadioGroup>
  );
}
