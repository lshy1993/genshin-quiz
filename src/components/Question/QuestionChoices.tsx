import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { Question } from '@/api/dto';
import MultipleChoice from '../Choice/MultipleChoice';
import SingleChoice from '../Choice/SingleChoice';
import TrueFalseChoice from '../Choice/TrueFalseChoice';

interface Props {
  question: Question;
  handleSubmit: (selectedOptions: string[]) => void;
}

export default function QuestionChoices({ question, handleSubmit }: Props) {
  // 记录用户选择的选项
  const [selected, setSelected] = useState<string[]>([]);
  // 记录是否已经提交
  const [submitted, setSubmitted] = useState(false && question.solved);

  const renderChoices = () => {
    switch (question.question_type) {
      case 'true_false':
        return (
          <TrueFalseChoice
            options={question.options}
            solved={question.solved}
            selected={selected}
            setSelected={setSelected}
            submitted={submitted}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoice
            options={question.options}
            solved={question.solved}
            selected={selected}
            setSelected={setSelected}
            submitted={submitted}
          />
        );
      default: // single_choice
        return (
          <SingleChoice
            options={question.options}
            solved={question.solved}
            selected={selected}
            setSelected={setSelected}
            submitted={submitted}
          />
        );
    }
  };

  const renderSubmitContent = () => {
    return (
      <Stack spacing={2}>
        {!question.solved ? (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setSubmitted(false);
                setSelected([]);
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
                {question.answers
                  ?.map((id) => question.options.find((opt) => opt.id === id)?.text || '')
                  .join('，')}
              </Typography>
            </Alert>
            {question.explanation && (
              <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                解析：{question.explanation}
              </Typography>
            )}
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
          disabled={selected.length === 0}
          onClick={() => {
            setSubmitted(true);
            handleSubmit(selected);
          }}
        >
          提交答案
        </Button>
      ) : (
        renderSubmitContent()
      )}
    </Stack>
  );
}
