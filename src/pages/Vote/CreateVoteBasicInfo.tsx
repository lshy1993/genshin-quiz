import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { t } from 'i18next';
import { DateTime } from 'luxon';
import type { QuestionCategory, VoteWithOption } from '@/api/dto';
import { allCategories } from '@/util/enum';

interface Props {
  errors: Record<string, string | undefined>;
  form: VoteWithOption;
  setForm: React.Dispatch<React.SetStateAction<VoteWithOption>>;
  setTouchedField: (field: string) => void;
}

export default function CreateVoteBasicInfo({ errors, form, setForm, setTouchedField }: Props) {
  const TimeForm = (
    <Stack direction="row" spacing={2}>
      <DateTimePicker
        label="开始时间"
        value={DateTime.fromJSDate(form.start_at)}
        ampm={false}
        onChange={(newValue) => {
          setTouchedField('start_at');
          setForm((prev) => ({
            ...prev,
            start_at: newValue?.toJSDate() ?? DateTime.now().toJSDate(),
          }));
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors?.start_at,
            helperText: errors?.start_at,
            required: true,
          },
        }}
      />
      <DateTimePicker
        label="截止时间"
        value={form.expire_at ? DateTime.fromJSDate(form.expire_at) : null}
        ampm={false}
        onChange={(newValue) => {
          setTouchedField('expire_at');
          setForm((prev) => ({
            ...prev,
            expire_at: newValue?.toJSDate() ?? DateTime.now().toJSDate(),
          }));
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors?.expires_at,
            helperText: errors?.expires_at,
          },
        }}
      />
    </Stack>
  );

  const TagForm = (
    <Autocomplete
      fullWidth
      multiple
      freeSolo
      size="small"
      options={[]}
      value={form.tags || []}
      onChange={(_, newValue) => {
        setTouchedField('tags');
        setForm((prev) => ({
          ...prev,
          tags: newValue
            .map((tag) => (typeof tag === 'string' ? tag.trim() : tag))
            .filter((tag) => tag.length > 0),
        }));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="标签"
          size="small"
          placeholder="输入标签并按回车添加"
          error={!!errors?.tags}
          helperText={errors?.tags}
        />
      )}
    />
  );

  const VoteLimitForm = (
    <Stack direction="row" spacing={2} alignItems="flex-top">
      <TextField
        type="number"
        size="small"
        label="每用户可投票数"
        value={form.votes_per_user || 1}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10) || 1;
          setTouchedField('votes_per_user');
          setForm((prev) => ({ ...prev, votes_per_user: value }));
        }}
        error={!!errors?.votes_per_user}
        helperText={errors?.votes_per_user}
        inputProps={{ min: 1 }}
        required
      />
      <TextField
        type="number"
        size="small"
        label="每选项最大票数"
        value={form.votes_per_option || 1}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10) || 1;
          setTouchedField('votes_per_option');
          setForm((prev) => ({ ...prev, votes_per_option: value }));
        }}
        error={!!errors?.votes_per_option}
        helperText={errors?.votes_per_option || '0表示无限制'}
        inputProps={{ min: 0 }}
      />
    </Stack>
  );

  const AccessibilityForm = (
    <Stack direction="row" spacing={2} alignItems="flex-top">
      <FormControl sx={{ width: 120 }} error={!!errors?.category}>
        <InputLabel>分类</InputLabel>
        <Select
          value={form.category || ''}
          size="small"
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
      <FormControlLabel
        control={
          <Switch
            checked={!form.public || false}
            onChange={(e) => {
              setTouchedField('public');
              setForm((prev) => ({ ...prev, public: !e.target.checked }));
            }}
          />
        }
        label="非公开投票"
      />
      {!form.public && (
        <TextField
          // fullWidth
          label="访问密码"
          size="small"
          value={form.password || ''}
          onChange={(e) => {
            setTouchedField('password');
            setForm((prev) => ({ ...prev, password: e.target.value }));
          }}
          error={!!errors?.password}
          helperText={errors?.password || '只有知道访问密码的用户才能参与投票'}
        />
      )}
    </Stack>
  );

  return (
    <Stack spacing={2}>
      {AccessibilityForm}
      {TimeForm}
      {TagForm}
      {VoteLimitForm}
    </Stack>
  );
}
