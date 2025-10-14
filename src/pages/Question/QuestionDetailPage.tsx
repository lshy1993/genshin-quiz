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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockQuestionData } from '@/util/mock';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  // 这里用 mock 数据，实际可用 useGetQuestion(id)
  const question = mockQuestionData.find((q) => q.id === id);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

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

  // 判断题型
  const isSingle =
    question.question_type === 'single_choice' || question.question_type === 'true_false';
  const isMultiple = question.question_type === 'multiple_choice';

  // 选项内容
  const options = question.options;

  // 正确答案
  const correct = ['1', '2'];
  const isCorrect = isSingle
    ? selected.length === 1 && correct.includes(selected[0])
    : selected.length === correct.length && selected.every((v) => correct.includes(v));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 900,
        minWidth: 480,
        mx: 'auto',
      }}
    >
      <Button component={Link} to="/questions" sx={{ mb: 2 }}>
        ← 返回题目列表
      </Button>

      <Card sx={{ mb: 3 }}>
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

          {/* 提交与结果 */}
          {!submitted && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={selected.length === 0}
              onClick={() => setSubmitted(true)}
            >
              提交答案
            </Button>
          )}
          {submitted && (
            <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 2 }}>
              {isCorrect ? '回答正确！' : '回答错误！'}
            </Alert>
          )}
          {submitted && (
            <Box sx={{ mt: 2 }}>
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
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
