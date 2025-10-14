import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Exam, Question } from '@/api/dto';
import { mockQuestionData } from '@/util/mock';

interface Props {
  exam: Exam;
}

interface AnswerRecord {
  point: number; // 该题得分
  answer: number; // 你的答案
  correct: boolean; // 是否正确
}

export default function ExamPlayPage({ exam }: Props) {
  const questionIds = exam.questions.map((q) => q.question_id);
  const questions: Question[] = mockQuestionData.filter((q) => questionIds.includes(q.id));

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});

  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestionIndex > exam.questions.length - 1) {
    // 统计得分
    const correctAnswers = Object.values(answers).filter(
      (record) => record.correct === true,
    ).length;
    const totalScore = (correctAnswers / exam.questions.length) * 100;

    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              测验完成！
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              你的得分: {Math.round(totalScore)}%
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              正确答案: {correctAnswers} / {exam.questions.length}
            </Typography>
            <Stack>
              {questions.map((q, idx) => {
                const record = answers[idx];
                return (
                  <Box key={q.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ width: '10%' }}>{idx + 1}</Box>
                    <Box sx={{ width: '60%' }}>{q.question_text || '-'}</Box>
                    <Box sx={{ width: '30%' }}>
                      {record ? (
                        record.answer
                      ) : (
                        <Chip label="未作答" color="default" size="small" />
                      )}
                    </Box>
                    <Box>
                      {record ? (
                        record.correct ? (
                          <Chip label="正确" color="success" size="small" />
                        ) : (
                          <Chip label="错误" color="error" size="small" />
                        )
                      ) : (
                        <Chip label="未作答" color="default" size="small" />
                      )}
                    </Box>
                    <Box>{record ? record.point : 0}</Box>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {exam.title}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          题目 {currentQuestionIndex + 1} / {questions.length}
        </Typography>
      </Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.question_text}
          </Typography>
        </CardContent>
      </Card>
      {exam.time_limit && (
        <Alert severity="info" sx={{ mt: 2 }}>
          时间限制: {exam.time_limit} 秒
        </Alert>
      )}
    </Box>
  );
}
