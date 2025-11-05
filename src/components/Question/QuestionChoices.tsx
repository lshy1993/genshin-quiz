import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { Question } from '@/api/dto';
import { postSubmitAnswer } from '@/api/genshinQuizAPI';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import MultipleChoice from '../Choice/MultipleChoice';
import SingleChoice from '../Choice/SingleChoice';
import TrueFalseChoice from '../Choice/TrueFalseChoice';

interface Props {
  question: Question;
  mutate: () => void;
}

export default function QuestionChoices({ question, mutate }: Props) {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useUser();
  // 记录用户选择的选项
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    question.solved
      ? question.options.filter((opt) => opt.is_answer).map((opt) => opt.id ?? '')
      : [],
  );
  // 记录是否已经提交
  const [submitted, setSubmitted] = useState(false || question.solved);
  const [isCorrect, setIsCorrect] = useState(false || question.solved);

  const handleSubmitClick = () => {
    postSubmitAnswer(question.id, {
      selected_option_ids: selectedOptions,
      time_spent: 0,
    })
      .then((res) => {
        // 提交后可以刷新提交记录等
        console.log('Submission result:', res.correct);
        setIsCorrect(res.correct);
        mutate();
        setSubmitted(true);
      })
      .catch((err) => {
        console.error('Failed to submit answer:', err);
      });
  };

  const renderChoices = () => {
    const isDisabled = submitted || !isAuthenticated;

    switch (question.question_type) {
      case 'true_false':
        return (
          <TrueFalseChoice
            options={question.options}
            solved={isCorrect && question.solved}
            selected={selectedOptions}
            setSelected={setSelectedOptions}
            disabled={isDisabled}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoice
            options={question.options}
            solved={isCorrect && question.solved}
            selected={selectedOptions}
            setSelected={setSelectedOptions}
            disabled={isDisabled}
          />
        );
      default: // single_choice
        return (
          <SingleChoice
            options={question.options}
            solved={isCorrect && question.solved}
            selected={selectedOptions}
            setSelected={setSelectedOptions}
            disabled={isDisabled}
          />
        );
    }
  };

  const renderSubmitContent = () => {
    return (
      <Stack spacing={2}>
        {!isCorrect ? (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setSubmitted(false);
                setSelectedOptions([]);
              }}
            >
              再试一次
            </Button>
            <Alert severity={'error'}>{'回答错误！'}</Alert>
          </>
        ) : (
          <>
            <Alert severity={'success'}>
              <Typography variant="body2" color="text.secondary">
                {'回答正确！答案：'}
                {question.options
                  .filter((opt) => opt.is_answer)
                  .map((opt) => opt.text?.[currentLanguage] ?? '')
                  .join('，')}
              </Typography>
            </Alert>
            {question.explanation && (
              <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                解析：{question.explanation}
              </Typography>
            )}
            <Button
              variant="outlined"
              onClick={() => {
                setSubmitted(false);
                setSelectedOptions([]);
              }}
            >
              再试一次
            </Button>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" startIcon={<ArrowForwardIcon />}>
                下一题
              </Button>
              <Button variant="outlined" startIcon={<ShuffleIcon />}>
                随机一题
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    );
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ alignItems: 'center' }}>
        <Typography variant="h4">{question.question_text}</Typography>
      </Box>
      {renderChoices()}
      {!submitted ? (
        <Button
          variant="contained"
          disabled={isAuthenticated && selectedOptions.length === 0}
          onClick={handleSubmitClick}
        >
          {isAuthenticated ? '提交答案' : '登录后答题'}
        </Button>
      ) : (
        renderSubmitContent()
      )}
    </Stack>
  );
}
