import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import { formatNumberShort } from '@/util/utils';

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
  const maxCount = Math.max(...options.map((opt) => opt.count ?? 0), 1);

  const renderOption = (opt: QuestionOption) => {
    const percent = maxCount > 0 ? Math.round(((opt.count ?? 0) / maxCount) * 100) : 0;
    return (
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
              value={percent}
              sx={{ height: 16, flex: 1, transition: '0.5s' }}
            />
            <Tooltip title={opt.count ?? 0} placement="bottom" arrow>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'right', minWidth: 40 }}
              >
                {`${formatNumberShort(opt.count ?? 0)}`}
              </Typography>
            </Tooltip>
          </Box>
        )}
      </Box>
    );
  };

  return <FormGroup>{options.map((opt, _) => renderOption(opt))}</FormGroup>;
}
