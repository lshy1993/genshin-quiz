import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@mui/material';
import type { QuestionType } from '@/api/dto';

interface Props {
  options: { id: string; text?: string; image?: string }[];
  selected: string[];
  setSelected: (value: string[]) => void;
  submitted: boolean;
  question_type: QuestionType;
}

export default function QuestionChoices({
  options,
  selected,
  setSelected,
  submitted,
  question_type,
}: Props) {
  const renderMultiple = () => {
    return (
      <FormGroup>
        {options.map((opt, _) => (
          <FormControlLabel
            key={opt.id}
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
        ))}
      </FormGroup>
    );
  };

  const renderSingle = () => {
    return (
      <RadioGroup value={selected[0] || ''} onChange={(e) => setSelected([e.target.value])}>
        {options.map((opt, _) => (
          <FormControlLabel
            key={opt.id}
            value={opt.id}
            control={<Radio />}
            label={opt.text || opt.image || ''}
            disabled={submitted}
          />
        ))}
      </RadioGroup>
    );
  };

  const renderTrueFalse = () => {
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
  };

  switch (question_type) {
    case 'true_false':
      return renderTrueFalse();
    case 'multiple_choice':
      return renderMultiple();
    default: // single_choice
      return renderSingle();
  }
}
