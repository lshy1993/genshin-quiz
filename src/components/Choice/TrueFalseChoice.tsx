import { Alert, Button, Stack } from '@mui/material';
import { t } from 'i18next';
import type { QuestionOption } from '@/api/dto';
import { useLanguage } from '@/context/LanguageContext';
import DualProgressBar from '../DualProgressBar';

interface Props {
  options: QuestionOption[];
  solved?: boolean;
  selected: string[];
  setSelected: (selected: string[]) => void;
  disabled?: boolean;
}

export default function renderTrueFalse({
  options,
  solved,
  selected,
  setSelected,
  disabled = false,
}: Props) {
  const { currentLanguage } = useLanguage();
  const yesOption = options.find((opt) => opt.text?.[currentLanguage] === 'yes');
  const noOption = options.find((opt) => opt.text?.[currentLanguage] === 'no');

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
          onClick={() => !disabled && yesOption.id && setSelected([yesOption.id])}
          disabled={disabled}
        >
          {'正确'}
        </Button>
        <Button
          key={noOption.id}
          variant={selected[0] === noOption.id ? 'contained' : 'outlined'}
          color={'error'}
          sx={{ flex: 1, height: 56, fontSize: 20, borderRadius: 2 }}
          onClick={() => !disabled && noOption.id && setSelected([noOption.id])}
          disabled={disabled}
        >
          {'错误'}
        </Button>
      </Stack>
      {solved && <DualProgressBar yesCount={yesCount} noCount={noCount} />}
    </>
  );
}
