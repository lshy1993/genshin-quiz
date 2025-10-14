import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import QuestionMySubmission from '@/components/QuestionMySubmission';
import QuestionRecentSubmission from '@/components/QuestionRecentSubmission';
import QuestionStatistics from '@/components/QuestionStatistics';
import {
  mockQuestionData,
  mockRecentQuestionSubmissions,
  type QuestionSubmission,
} from '@/util/mock';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  // 这里用 mock 数据，实际可用 useGetQuestion(id)
  const question = mockQuestionData.find((q) => q.id === id);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submissionList, setSubmissionList] = useState<QuestionSubmission[]>([]);

  if (!question) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">未找到该题目</Typography>
        <Button component={Link} to="/questions" sx={{ mt: 2 }}>
          返回题目列表
        </Button>
      </Box>
    );
  }

  // 临时mock其他用户提交数据
  const recentSubmissions = mockRecentQuestionSubmissions;

  // 判断题型
  const isSingle =
    question.question_type === 'single_choice' || question.question_type === 'true_false';
  const isMultiple = question.question_type === 'multiple_choice';

  // 选项内容
  const options = question.options;

  // 正确答案（假设用 options 的 id，实际应从 question.answers 获取）
  const correct = question.options
    .filter(
      (opt) =>
        opt.text?.includes('正确') || opt.text?.includes('以上都是') || opt.text === 'miHoYo',
    )
    .map((opt) => opt.id);
  const isCorrect = isSingle
    ? selected.length === 1 && correct.includes(selected[0])
    : selected.length === correct.length && selected.every((v) => correct.includes(v));

  const renderSubmitContent = () => {
    return (
      <>
        <Alert severity={isCorrect ? 'success' : 'error'}>
          {isCorrect ? '回答正确！' : '回答错误！'}
        </Alert>
        {!isCorrect ? (
          <Button
            variant="outlined"
            onClick={() => {
              setSubmitted(false);
              setSelected([]);
            }}
          >
            再试一次
          </Button>
        ) : (
          <>
            <Box>
              <Typography variant="body2" color="text.secondary">
                正确答案：
                {correct.map((id) => options.find((opt) => opt.id === id)?.text || '').join('，')}
              </Typography>
              {question.explanation && (
                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                  解析：{question.explanation}
                </Typography>
              )}
            </Box>
            <QuestionStatistics options={options} />
          </>
        )}
      </>
    );
  };

  return (
    <PageContainer>
      <Button size="small" component={Link} to="/questions">
        ← 返回题目列表
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {question.question_text}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label={question.difficulty} color="primary" sx={{ mr: 1 }} />
            <Chip label={question.category} color="secondary" sx={{ mr: 1 }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            创建时间: {question.created_at.toLocaleString()}
          </Typography>
          {/* 选项区 */}
          {isSingle && (
            <RadioGroup value={selected[0] || ''} onChange={(e) => setSelected([e.target.value])}>
              {options.map((opt, _) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.id}
                  control={<Radio />}
                  label={opt.text || opt.image || ''}
                  disabled={submitted}
                />
              ))}
            </RadioGroup>
          )}
          {isMultiple && (
            <FormGroup>
              {options.map((opt, _) => (
                <FormControlLabel
                  key={opt.id}
                  control={
                    <Checkbox
                      checked={selected.includes(opt.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelected([...selected, opt.id]);
                        else setSelected(selected.filter((v) => v !== opt.id));
                      }}
                      disabled={submitted}
                    />
                  }
                  label={opt.text || opt.image || ''}
                />
              ))}
            </FormGroup>
          )}
          {/* 提交与结果/多次尝试/提交记录 */}
          <Stack spacing={2} sx={{ mt: 2 }}>
            {!submitted ? (
              <Button
                variant="contained"
                disabled={selected.length === 0}
                onClick={() => {
                  setSubmitted(true);
                  setSubmissionList((list) => [
                    ...list,
                    {
                      user_name: '',
                      selected: [...selected],
                      correct: isCorrect,
                      submitted_at: DateTime.now(),
                    },
                  ]);
                }}
              >
                提交答案
              </Button>
            ) : (
              renderSubmitContent()
            )}
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <QuestionMySubmission submissionList={submissionList} options={options} />
        <QuestionRecentSubmission recentSubmissions={recentSubmissions} />
      </Card>
    </PageContainer>
  );
}
