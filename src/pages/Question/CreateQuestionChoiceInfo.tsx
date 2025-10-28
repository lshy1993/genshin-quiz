import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { QuestionOptionType, QuestionType, type QuestionWithAnswer } from '@/api/dto';
import LanguageTabs from '@/components/LanguageTabs';
import CreateQuestionChoice from './CreateQuestionChoice';

interface Props {
  errors: Record<string, string | undefined>;
  form: QuestionWithAnswer;
  setForm: React.Dispatch<React.SetStateAction<QuestionWithAnswer>>;
  setTouchedField: (field: string) => void;
  removeTouchedField: (field: string) => void;
}

export default function CreateQuestionChoiceInfo({
  form,
  setForm,
  errors,
  setTouchedField,
  removeTouchedField,
}: Props) {
  const [currentLang, setCurrentLang] = useState<string>('zh');
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
    setTouchedField(`options.${options.length}.text.${currentLang}`);
    setForm((prev) => {
      const new_option = {
        id: '',
        type: QuestionOptionType.text,
        text: { [currentLang]: '' },
        is_answer: false,
      };
      return {
        ...prev,
        options: [...prev.options, new_option],
      };
    });
  };

  // 删除选项
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // 最少保留2个选项
    removeTouchedField(`options.${index}.text.${currentLang}`);
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

  // 添加新语言
  const handleAddLanguage = (lang: string) => {
    if (!lang) return;
    // 为每个文本部分添加新的
    setForm((prev) => {
      const new_options = prev.options.map((opt) => ({
        ...opt,
        text: { ...opt.text, [lang]: '' },
      }));
      return {
        ...prev,
        question_text: { ...prev.question_text, [lang]: '' },
        explanation: { ...prev.explanation, [lang]: '' },
        options: new_options,
      };
    });
    setCurrentLang(lang);
  };

  const handleDeleteLanguage = (lang: string) => {
    // 至少保留一个语言
    if (Object.keys(form.question_text).length <= 1) return;

    setForm((prev) => {
      // 删除 question_text 和 explanation 的该语言
      const { [lang]: _, ...new_question_text } = prev.question_text;
      const { [lang]: __, ...new_explanation } = prev.explanation || {};

      // 删除 options 里 text 的该语言
      const new_options = prev.options.map((opt) => {
        const { [lang]: ___, ...new_text } = opt.text || {};
        return { ...opt, text: new_text };
      });

      // 计算剩余语言，如果当前语言被删，切换到第一个剩余语言
      const langs = Object.keys(new_question_text);
      if (currentLang === lang && langs.length > 0) {
        setCurrentLang(langs[0]);
      }

      return {
        ...prev,
        question_text: new_question_text,
        explanation: new_explanation,
        options: new_options,
      };
    });
  };

  const renderChoiceOptions = () => {
    return (
      <Stack direction="column" spacing={3}>
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
        {form.question_type !== QuestionType.true_false && (
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addOption}>
            添加选项
          </Button>
        )}
      </Stack>
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
        <Typography>选择正确答案</Typography>
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
    <Card variant="outlined">
      <LanguageTabs
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        selectedLanguages={Object.keys(form.question_text)}
        handleDeleteLanguage={handleDeleteLanguage}
        handleAddLanguage={handleAddLanguage}
      />
      <CardContent>
        <Stack spacing={2}>
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
      </CardContent>
    </Card>
  );
}
