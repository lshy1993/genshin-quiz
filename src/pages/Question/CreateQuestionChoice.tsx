import { Delete as DeleteIcon } from '@mui/icons-material';
import { FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { type QuestionTranslationOptionsItem, QuestionType } from '@/api/dto';

interface Props {
  questionType: QuestionType;
  option: QuestionTranslationOptionsItem;
  index: number;
  setCorrectAnswer: (i: number) => void;
  toggleMultipleAnswer: (i: number) => void;
  updateOption: (i: number, str: string) => void;
  removeOption: (i: number) => void;
  showDeleteIcon: boolean;
}

export default function CreateQuestionChoice({
  questionType,
  option,
  index,
  setCorrectAnswer,
  toggleMultipleAnswer,
  updateOption,
  removeOption,
  showDeleteIcon,
}: Props) {
  const [tmpInput, setTmpInput] = useState<string>(option.text);
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* 单选 */}
      {questionType === QuestionType.single_choice && (
        <RadioGroup
          value={option.is_answer ? index : -1}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
        >
          <FormControlLabel value={index} control={<Radio />} label="" sx={{ margin: 0 }} />
        </RadioGroup>
      )}

      {/* 多选 */}
      {questionType === QuestionType.multiple_choice && (
        <FormControlLabel
          control={
            <input
              type="checkbox"
              checked={option.is_answer}
              onChange={() => toggleMultipleAnswer(index)}
            />
          }
          label=""
          sx={{ margin: 0 }}
        />
      )}

      <TextField
        label={`选项 ${index + 1}`}
        value={tmpInput}
        onChange={(e) => setTmpInput(e.target.value)}
        onBlur={() => updateOption(index, tmpInput)}
        fullWidth
        size="small"
        required
      />
      {showDeleteIcon && (
        <IconButton onClick={() => removeOption(index)} color="error">
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
}
