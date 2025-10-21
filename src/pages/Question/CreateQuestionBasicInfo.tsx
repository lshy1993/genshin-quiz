import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import type {
  QuestionCategory,
  QuestionDifficulty,
  QuestionType,
  QuestionWithAnswer,
} from '@/api/dto';
import { allCategories, allDifficulties, allQuestionTypes } from '@/util/enum';

interface Props {
  errors: Record<string, string>;
  form: QuestionWithAnswer;
  setForm: React.Dispatch<React.SetStateAction<QuestionWithAnswer>>;
}

export default function CreateQuestionBasicInfo({ errors, form, setForm }: Props) {
  return (
    <Stack spacing={1} direction="row">
      <FormControlLabel
        control={
          <input
            type="checkbox"
            checked={form.public}
            onChange={() => setForm((prev) => ({ ...prev, public: !prev.public }))}
          />
        }
        label="是否公开"
      />
      <FormControl error={!!errors.question_type}>
        <InputLabel>题目类型</InputLabel>
        <Select
          value={form.question_type}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, question_type: e.target.value as QuestionType }))
          }
          label="题目类型"
          required
        >
          {allQuestionTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl error={!!errors.category}>
        <InputLabel>分类</InputLabel>
        <Select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, category: e.target.value as QuestionCategory }))
          }
          label="分类"
          required
        >
          {allCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl error={!!errors.difficulty}>
        <InputLabel>难度</InputLabel>
        <Select
          value={form.difficulty}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              difficulty: e.target.value as QuestionDifficulty,
            }))
          }
          label="难度"
          required
        >
          {allDifficulties.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {diff}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
