import { Alert, Button, Stack } from '@mui/material';
import { t } from 'i18next';
import type { QuestionOption } from '@/api/dto';
import DualProgressBar from '../DualProgressBar';

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
  const yesOption = options.find((opt) => opt.text === 'true');
  const noOption = options.find((opt) => opt.text === 'false');

  if (!yesOption || !noOption) {
    return <Alert severity="error">{t('question.error.options_invalid')}</Alert>;
  }

  const yesCount = yesOption.count ?? 0;
  const noCount = noOption.count ?? 0;

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button
          key={yesOption.id}
          variant={selected[0] === yesOption.id ? 'contained' : 'outlined'}
          color={'success'}
          sx={{ flex: 1, height: 56, fontSize: 20, borderRadius: 2 }}
          onClick={() => !submitted && setSelected([yesOption.id])}
          disabled={submitted}
        >
          {'正确'}
        </Button>
        <Button
          key={noOption.id}
          variant={selected[0] === noOption.id ? 'contained' : 'outlined'}
          color={'error'}
          sx={{ flex: 1, height: 56, fontSize: 20, borderRadius: 2 }}
          onClick={() => !submitted && setSelected([noOption.id])}
          disabled={submitted}
        >
          {'错误'}
        </Button>
      </Stack>
      {solved && <DualProgressBar yesCount={yesCount} noCount={noCount} />}
    </>
  );
}
