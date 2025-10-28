import { Add as AddIcon } from '@mui/icons-material';
import {
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
import { QuestionOptionType, QuestionType, type QuestionWithAnswer } from '@/api/dto';
import { allLanguages } from '@/util/enum';
import CreateQuestionChoice from './CreateQuestionChoice';

interface Props {
  errors: Record<string, string | undefined>;
  form: QuestionWithAnswer;
  setForm: React.Dispatch<React.SetStateAction<QuestionWithAnswer>>;
  setTouchedField: (field: string) => void;
}

export default function CreateQuestionChoiceInfo({
  form,
  setForm,
  errors,
  setTouchedField,
}: Props) {
  const [currentLang, setCurrentLang] = useState<string>('zh');
  const [isAddLangDialogOpen, setIsAddLangDialogOpen] = useState(false);
  const [selectedNewLang, setSelectedNewLang] = useState<string>('');

  const options = form.options;

  const handleQuestionTextChange = (newText: string) => {
    setTouchedField(`question_text.${currentLang}`);
    setForm((prev) => {
      // 修改该语言的数据
      const new_question_text = { ...prev.question_text, [currentLang]: newText };
      return {
        ...prev,
        question_text: new_question_text,
      };
    });
  };

  const handleQuestionExplanationChange = (newText: string) => {
    setTouchedField(`explanation.${currentLang}`);
    setForm((prev) => {
      // 修改该语言的数据
      const new_explanation = { ...prev.explanation, [currentLang]: newText };
      return {
        ...prev,
        explanation: new_explanation,
      };
    });
  };

  // 添加选项
  const addOption = () => {
    setForm((prev) => {
      const new_option = { id: '', type: QuestionOptionType.text, text: {}, is_answer: false };
      return {
        ...prev,
        options: [...prev.options, new_option],
      };
    });
  };

  // 删除选项
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // 最少保留2个选项
    setForm((prev) => {
      const new_options = prev.options.filter((_, i) => i !== index);
      return {
        ...prev,
        options: new_options,
      };
    });
  };

  // 更新选项内容
  const updateOption = (index: number, text: string) => {
    setTouchedField(`options.${index}.text.${currentLang}`);
    setForm((prev) => {
      const new_options = options.map((opt, i) =>
        i === index ? { ...opt, text: { ...opt.text, [currentLang]: text } } : opt,
      );
      return {
        ...prev,
        options: new_options,
      };
    });
  };

  // 设置正确答案
  const setCorrectAnswer = (index: number) => {
    setTouchedField(`options.${index}.text.${currentLang}`);
    setForm((prev) => {
      const new_options = prev.options.map((opt, i) => ({
        ...opt,
        is_answer: form.question_type === QuestionType.single_choice ? i === index : opt.is_answer,
      }));
      return {
        ...prev,
        options: new_options,
      };
    });
  };

  // 切换多选答案
  const toggleMultipleAnswer = (index: number) => {
    const new_options = options.map((opt, i) =>
      i === index ? { ...opt, is_answer: !opt.is_answer } : opt,
    );
    setTouchedField(`options.${index}.text.${currentLang}`);
    setForm((prev) => ({
      ...prev,
      options: new_options,
    }));
  };

  // 语言选择处理
  const handleLanguageChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentLang(newValue);
  };

  // 获取可添加的语言列表
  const getAvailableLanguages = () => {
    const existingLangs = Object.keys(form.question_text);
    return allLanguages.filter((lang) => !existingLangs.includes(lang));
  };

  // 添加新语言
  const addNewLanguage = () => {
    if (!selectedNewLang) return;
    // 为每个文本部分添加新的
    setForm((prev) => {
      const new_options = prev.options.map((opt) => ({
        ...opt,
        text: { ...opt.text, [selectedNewLang]: '' },
      }));
      return {
        ...prev,
        question_text: { ...prev.question_text, [selectedNewLang]: '' },
        explanation: { ...prev.explanation, [selectedNewLang]: '' },
        options: new_options,
      };
    });
    setCurrentLang(selectedNewLang);
    setSelectedNewLang('');
    setIsAddLangDialogOpen(false);
  };

  const renderChoiceOptions = () => {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          题目选项 {errors?.options && <span style={{ color: 'red' }}>*{errors.options}</span>}
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
                  error={errors[`options.${index}.text.${currentLang}`]}
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

  // 设置正确答案
  const setTrueFalseAnswer = (isTrue: boolean) => {
    setForm((prev) => ({
      ...prev,
      options: [
        { id: '', type: QuestionOptionType.text, text: { zh: '是' }, is_answer: isTrue },
        { id: '', type: QuestionOptionType.text, text: { zh: '否' }, is_answer: !isTrue },
      ],
    }));
  };

  const renderTrueFalseOptions = () => {
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

  const questionTextError = errors?.[`question_text.${currentLang}`];
  const explanationError = errors?.[`explanation.${currentLang}`];

  return (
    <>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tabs value={currentLang} onChange={handleLanguageChange} sx={{ flexGrow: 1 }}>
            {Object.keys(form.question_text).map((lang) => {
              return <Tab key={lang} label={lang} value={lang} />;
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
          value={form.question_text[currentLang]}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          error={!!questionTextError}
          helperText={questionTextError}
          fullWidth
        />
        {form.question_type === QuestionType.true_false
          ? renderTrueFalseOptions()
          : renderChoiceOptions()}
        <TextField
          label="题目解析"
          multiline
          minRows={3}
          value={form.explanation?.[currentLang] ?? ''}
          onChange={(e) => handleQuestionExplanationChange(e.target.value)}
          error={!!explanationError}
          helperText={explanationError}
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
