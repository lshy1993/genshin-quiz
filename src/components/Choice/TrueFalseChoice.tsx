import { Box, Button } from '@mui/material';
import type { QuestionOption } from '@/api/dto';

interface Props {
  options: QuestionOption[];
  solved?: boolean;
  selected: string[];
  setSelected: (selected: string[]) => void;
  submitted: boolean;
}

export default function renderTrueFalse({
  options,
  solved,
  selected,
  setSelected,
  submitted,
}: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
      {options.slice(0, 2).map((opt) => (
        <Button
          key={opt.id}
          variant={selected[0] === opt.id ? 'contained' : 'outlined'}
          color={opt.text === '正确' ? 'success' : opt.text === '错误' ? 'error' : 'primary'}
          sx={{ flex: 1, height: 56, fontSize: 20, borderRadius: 2 }}
          onClick={() => !submitted && setSelected([opt.id])}
          disabled={submitted}
        >
          {opt.text || opt.image || ''}
        </Button>
      ))}
    </Box>
  );
}
