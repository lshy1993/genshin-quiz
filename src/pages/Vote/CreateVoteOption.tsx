import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Stack, TextField } from '@mui/material';

interface Props {
  index: number;
  optionText: string;
  updateOption: (i: number, str: string) => void;
  removeOption: (i: number) => void;
  showDeleteIcon: boolean;
  error: string | undefined;
}

export default function CreateVoteOption({
  index,
  optionText,
  updateOption,
  removeOption,
  showDeleteIcon,
  error,
}: Props) {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="投票内容"
        value={optionText || ''}
        onChange={(e) => updateOption(index, e.target.value)}
        // onBlur={() => setTouchedField(`options.${index}.text.${currentLang}`)}
        // error={!!errors[`options.${index}.text.${currentLang}`]}
        // helperText={errors[`options.${index}.text.${currentLang}`]}
      />
      {showDeleteIcon && (
        <IconButton onClick={() => removeOption(index)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
}
