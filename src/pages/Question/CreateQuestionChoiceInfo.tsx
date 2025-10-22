import { Add as AddIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { $ZodIssue } from 'zod/v4/core';
import {
  QuestionType,
  type QuestionWithAnswer,
  type QuestionWithAnswerTranslationsItem,
} from '@/api/dto';
import { allLanguages } from '@/util/enum';
import CreateQuestionChoice from './CreateQuestionChoice';

interface Props {
  errors: $ZodIssue[] | undefined;
  form: QuestionWithAnswer;
  setForm: React.Dispatch<React.SetStateAction<QuestionWithAnswer>>;
}

export default function CreateQuestionChoiceInfo({ form, setForm, errors }: Props) {
  const [currentLang, setCurrentLang] = useState<string>('zh');
  const [isAddLangDialogOpen, setIsAddLangDialogOpen] = useState(false);
  const [selectedNewLang, setSelectedNewLang] = useState<string>('');

  const otherData = form.translations.filter((x) => x.language !== currentLang);
  const languageData = form.translations?.find((x) => x.language === currentLang);
  if (!languageData) {
    return <Alert>Wrong Language</Alert>;
  }
  const options = languageData.text.options;

  const handleQuestionTestChange = (newText: string) => {
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, question_text: newText },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  const handleQuestionExplanation = (newText: string) => {
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, explanation: newText },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 添加选项
  const addOption = () => {
    const new_options = [...options, { text: '', is_answer: false }];
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, options: new_options },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 删除选项
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // 最少保留2个选项
    const new_options = options.filter((_, i) => i !== index);
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, options: new_options },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 更新选项内容
  const updateOption = (index: number, text: string) => {
    const new_options = options.map((opt, i) => (i === index ? { ...opt, text } : opt));
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, options: new_options },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 设置正确答案
  const setCorrectAnswer = (index: number) => {
    const new_options = options.map((opt, i) => ({
      ...opt,
      is_answer: form.question_type === QuestionType.single_choice ? i === index : opt.is_answer,
    }));
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, options: new_options },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 切换多选答案
  const toggleMultipleAnswer = (index: number) => {
    const new_options = options.map((opt, i) =>
      i === index ? { ...opt, is_answer: !opt.is_answer } : opt,
    );
    const newData: QuestionWithAnswerTranslationsItem = {
      language: currentLang,
      text: { ...languageData.text, options: new_options },
    };
    setForm((prev) => ({
      ...prev,
      translations: [...otherData, newData],
    }));
  };

  // 语言选择处理
  const handleLanguageChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentLang(newValue);
  };

  // 获取可添加的语言列表
  const getAvailableLanguages = () => {
    const existingLangs = form.translations.map((t) => t.language);
    return allLanguages.filter((lang) => !existingLangs.includes(lang));
  };

  // 添加新语言
  const addNewLanguage = () => {
    if (!selectedNewLang) return;

    const newTranslation: QuestionWithAnswerTranslationsItem = {
      language: selectedNewLang,
      text: {
        question_text: '',
        explanation: '',
        options:
          form.question_type === QuestionType.true_false
            ? [
                { text: '是', is_answer: false },
                { text: '否', is_answer: false },
              ]
            : [
                { text: '', is_answer: false },
                { text: '', is_answer: false },
              ],
      },
    };

    setForm((prev) => ({
      ...prev,
      translations: [...prev.translations, newTranslation],
    }));

    setCurrentLang(selectedNewLang);
    setSelectedNewLang('');
    setIsAddLangDialogOpen(false);
  };

  const renderChoiceOptions = () => {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          题目选项{' '}
          {errors?.find((err) => err.path.includes('options')) && (
            <span style={{ color: 'red' }}>
              *{errors.find((err) => err.path.includes('options'))?.message}
            </span>
          )}
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="column" spacing={2}>
              {options.map((option, index) => (
                <CreateQuestionChoice
                  key={`${index}-${option.text}`}
                  questionType={form.question_type}
                  option={option}
                  index={index}
                  setCorrectAnswer={setCorrectAnswer}
                  toggleMultipleAnswer={toggleMultipleAnswer}
                  updateOption={updateOption}
                  removeOption={removeOption}
                  showDeleteIcon={options.length > 2}
                />
              ))}
            </Stack>
            {form.question_type !== QuestionType.true_false && (
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addOption} sx={{ mt: 1 }}>
                添加选项
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderTrueFalseOptions = () => {
    // 设置正确答案
    const setTrueFalseAnswer = (isTrue: boolean) => {
      setForm((prev) => ({
        ...prev,
        options: [
          { text: '是', is_answer: isTrue },
          { text: '否', is_answer: !isTrue },
        ],
      }));
    };

    const yesSelected = options.length > 0 && options[0]?.is_answer;
    const noSelected = options.length > 1 && options[1]?.is_answer;

    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          选择正确答案
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
          {/* 是 选项 */}
          <FormControlLabel
            control={
              <input
                type="checkbox"
                checked={yesSelected}
                onChange={() => setTrueFalseAnswer(true)}
                style={{ transform: 'scale(1.5)' }}
              />
            }
            label={
              <Typography variant="h6" sx={{ ml: 1 }}>
                是
              </Typography>
            }
          />

          {/* 否 选项 */}
          <FormControlLabel
            control={
              <input
                type="checkbox"
                checked={noSelected}
                onChange={() => setTrueFalseAnswer(false)}
                style={{ transform: 'scale(1.5)' }}
              />
            }
            label={
              <Typography variant="h6" sx={{ ml: 1 }}>
                否
              </Typography>
            }
          />
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tabs value={currentLang} onChange={handleLanguageChange} sx={{ flexGrow: 1 }}>
            {form.translations.map((trans) => {
              return <Tab key={trans.language} label={trans.language} value={trans.language} />;
            })}
          </Tabs>
          {getAvailableLanguages().length > 0 && (
            <IconButton
              onClick={() => setIsAddLangDialogOpen(true)}
              size="small"
              sx={{
                border: '1px dashed #ccc',
                borderRadius: 1,
                minWidth: 40,
                minHeight: 32,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <TextField
          label="题目内容"
          multiline
          minRows={3}
          value={languageData.text.question_text}
          onChange={(e) => handleQuestionTestChange(e.target.value)}
          error={!!errors?.find((err) => err.path.includes('question_text'))}
          helperText={errors?.find((err) => err.path.includes('question_text'))?.message}
          required
          fullWidth
        />
        {form.question_type === QuestionType.true_false
          ? renderTrueFalseOptions()
          : renderChoiceOptions()}
        <TextField
          label="题目解析"
          multiline
          minRows={3}
          value={languageData.text.explanation}
          onChange={(e) => handleQuestionExplanation(e.target.value)}
          error={!!errors?.find((err) => err.path.includes('explanation'))}
          helperText={errors?.find((err) => err.path.includes('explanation'))?.message}
          required
          fullWidth
        />
      </Stack>
      {/* 添加语言对话框 */}
      <Dialog
        open={isAddLangDialogOpen}
        onClose={() => setIsAddLangDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>添加新语言</DialogTitle>
        <DialogContent>
          <Select
            value={selectedNewLang}
            onChange={(e) => setSelectedNewLang(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mt: 1 }}
          >
            <MenuItem value="">
              <em>请选择语言</em>
            </MenuItem>
            {getAvailableLanguages().map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddLangDialogOpen(false)}>取消</Button>
          <Button onClick={addNewLanguage} variant="contained" disabled={!selectedNewLang}>
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
