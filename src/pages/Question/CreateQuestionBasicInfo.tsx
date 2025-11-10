import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { t } from 'i18next';
import type {
  QuestionCategory,
  QuestionDifficulty,
  QuestionType,
  QuestionWithAnswer,
} from '@/api/dto';
import { allCategories, allDifficulties, allQuestionTypes } from '@/util/enum';

interface Props {
  errors: Record<string, string | undefined>;
  form: QuestionWithAnswer;
  setForm: React.Dispatch<React.SetStateAction<QuestionWithAnswer>>;
  setTouchedField: (field: string) => void;
}

export default function CreateQuestionBasicInfo({ errors, form, setForm, setTouchedField }: Props) {
  return (
    <Stack spacing={1} direction="row">
      {/* <FormControlLabel
        control={
          <input
            type="checkbox"
            checked={form.public}
            onChange={() => {
              setTouchedField('public');
              setForm((prev) => ({ ...prev, public: !prev.public }));
            }}
          />
        }
        label="是否公开"
      /> */}
      <FormControl sx={{ width: 120 }} error={!!errors?.question_type}>
        <InputLabel>题目类型</InputLabel>
        <Select
          value={form.question_type}
          onChange={(e) => {
            const newType = e.target.value as QuestionType;
            setTouchedField('question_type');
            setForm((prev) => {
              const { options, ...rest } = prev;
              return {
                ...rest,
                question_type: newType,
                options:
                  newType === 'true_false'
                    ? [
                        { type: 'text', text: { zh: 'yes' }, is_answer: true },
                        { type: 'text', text: { zh: 'no' }, is_answer: false },
                      ]
                    : options,
              };
            });
          }}
          label="题目类型"
          required
        >
          {allQuestionTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`question.type.${type}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 120 }} error={!!errors?.category}>
        <InputLabel>分类</InputLabel>
        <Select
          value={form.category}
          onChange={(e) => {
            setTouchedField('category');
            setForm((prev) => ({ ...prev, category: e.target.value as QuestionCategory }));
          }}
          label="分类"
          required
        >
          {allCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {t(`question.category.${cat}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 120 }} error={!!errors?.difficulty}>
        <InputLabel>难度</InputLabel>
        <Select
          value={form.difficulty}
          onChange={(e) => {
            setTouchedField('difficulty');
            setForm((prev) => ({
              ...prev,
              difficulty: e.target.value as QuestionDifficulty,
            }));
          }}
          label="难度"
          required
        >
          {allDifficulties.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {t(`question.difficulty.${diff}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
