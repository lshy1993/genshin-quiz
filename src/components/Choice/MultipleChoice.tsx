import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
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

export default function renderMultiple({
  options,
  solved,
  selected,
  setSelected,
  submitted,
}: Props) {
  return (
    <FormGroup>
      {options.map((opt, _) => (
        <Box key={opt.id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.includes(opt.id)}
                onChange={(e) => {
                  if (e.target.checked) setSelected([...selected, opt.id]);
                  else setSelected(selected.filter((v) => v !== opt.id));
                }}
                disabled={submitted}
              />
            }
            label={opt.text || opt.image || ''}
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
    </FormGroup>
  );
}
