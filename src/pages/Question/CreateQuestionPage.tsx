import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { QuestionCategory, QuestionDifficulty, QuestionType } from '@/api/dto';
import { postCreateQuestion } from '@/api/genshinQuizAPI';
import PageContainer from '@/components/PageContainer';
import { useUser } from '@/context/UserContext';
import { allCategories, allDifficulties, allLanguages, allQuestionTypes } from '@/util/enum';

// Zod 验证 schema
const createQuestionSchema = z.object({
  question_text: z.string().min(1, '题目内容不能为空'),
  category: z.nativeEnum(QuestionCategory, { message: '请选择题目分类' }),
  difficulty: z.nativeEnum(QuestionDifficulty, { message: '请选择题目难度' }),
  question_type: z.nativeEnum(QuestionType, { message: '请选择题目类型' }),
  languages: z.array(z.string()).min(1, '至少选择一种语言'),
  explanation: z.string().min(1, '请填写题目解析'),
  options: z
    .array(
      z.object({
        text: z.string().min(1, '选项内容不能为空'),
        is_answer: z.boolean(),
      }),
    )
    .min(2, '至少需要两个选项')
    .refine((options) => options.some((opt) => opt.is_answer), {
      message: '至少选择一个正确答案',
    }),
});

type CreateQuestionForm = z.infer<typeof createQuestionSchema>;

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [form, setForm] = useState<CreateQuestionForm>({
    question_text: '',
    category: QuestionCategory.character,
    difficulty: QuestionDifficulty.easy,
    question_type: QuestionType.single_choice,
    languages: ['zh'],
    explanation: '',
    options: [
      { text: '', is_answer: false },
      { text: '', is_answer: false },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 如果用户未登录，重定向到登录页
  if (!user) {
    navigate('/login');
    return null;
  }

  // 添加选项
  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', is_answer: false }],
    }));
  };

  // 删除选项
  const removeOption = (index: number) => {
    if (form.options.length <= 2) return; // 最少保留2个选项
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // 更新选项内容
  const updateOption = (index: number, text: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? { ...opt, text } : opt)),
    }));
  };

  // 设置正确答案
  const setCorrectAnswer = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => ({
        ...opt,
        is_answer: form.question_type === QuestionType.single_choice ? i === index : opt.is_answer,
      })),
    }));
  };

  // 切换多选答案
  const toggleMultipleAnswer = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, is_answer: !opt.is_answer } : opt,
      ),
    }));
  };

  // 语言选择处理
  const handleLanguageChange = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 验证表单
    const result = createQuestionSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // 构造符合 API 要求的数据结构
      const questionData = {
        id: crypto.randomUUID(), // 生成临时 ID
        public: true,
        question_text: form.question_text,
        category: form.category,
        difficulty: form.difficulty,
        question_type: form.question_type,
        languages: form.languages,
        explanation: form.explanation,
        options: form.options.map((opt) => ({
          id: crypto.randomUUID(),
          type: 'text' as const,
          text: opt.text,
          is_answer: opt.is_answer,
          count: 0,
        })),
        answer_count: 0,
        correct_count: 0,
        likes: 0,
        created_by: user ? user.uuid : '',
        created_at: new Date(),
        answers: [], // QuestionWithAnswer 需要的字段
      };

      await postCreateQuestion(questionData);

      // 创建成功，跳转到题目列表
      navigate('/questions');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '创建失败，请重试';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          创建新题目
        </Typography>

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 题目内容 */}
            <TextField
              label="题目内容"
              multiline
              minRows={3}
              value={form.question_text}
              onChange={(e) => setForm((prev) => ({ ...prev, question_text: e.target.value }))}
              error={!!errors.question_text}
              helperText={errors.question_text}
              required
              fullWidth
            />

            {/* 基本信息 */}
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
              <FormControl error={!!errors.category}>
                <InputLabel>分类</InputLabel>
                <Select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as QuestionCategory }))
                  }
                  label="分类"
                  required
                >
                  {allCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl error={!!errors.difficulty}>
                <InputLabel>难度</InputLabel>
                <Select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      difficulty: e.target.value as QuestionDifficulty,
                    }))
                  }
                  label="难度"
                  required
                >
                  {allDifficulties.map((diff) => (
                    <MenuItem key={diff} value={diff}>
                      {diff}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl error={!!errors.question_type}>
                <InputLabel>题目类型</InputLabel>
                <Select
                  value={form.question_type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, question_type: e.target.value as QuestionType }))
                  }
                  label="题目类型"
                  required
                >
                  {allQuestionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 语言选择 */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                支持语言{' '}
                {errors.languages && <span style={{ color: 'red' }}>*{errors.languages}</span>}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {allLanguages.map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    clickable
                    variant={form.languages.includes(lang) ? 'filled' : 'outlined'}
                    onClick={() => handleLanguageChange(lang)}
                  />
                ))}
              </Stack>
            </Box>

            {/* 选项设置 */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                题目选项 {errors.options && <span style={{ color: 'red' }}>*{errors.options}</span>}
              </Typography>
              {form.options.map((option, index) => (
                <Card
                  key={`option-${index}-${option.text.slice(0, 5)}`}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* 单选 */}
                      {form.question_type === QuestionType.single_choice && (
                        <RadioGroup
                          value={option.is_answer ? index : -1}
                          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                        >
                          <FormControlLabel
                            value={index}
                            control={<Radio />}
                            label=""
                            sx={{ margin: 0 }}
                          />
                        </RadioGroup>
                      )}

                      {/* 多选 */}
                      {form.question_type === QuestionType.multiple_choice && (
                        <FormControlLabel
                          control={
                            <input
                              type="checkbox"
                              checked={option.is_answer}
                              onChange={() => toggleMultipleAnswer(index)}
                            />
                          }
                          label=""
                          sx={{ margin: 0 }}
                        />
                      )}

                      {/* 判断题 */}
                      {form.question_type === QuestionType.true_false && index < 2 && (
                        <FormControlLabel
                          control={
                            <Radio
                              checked={option.is_answer}
                              onChange={() => setCorrectAnswer(index)}
                            />
                          }
                          label=""
                          sx={{ margin: 0 }}
                        />
                      )}

                      <TextField
                        label={`选项 ${index + 1}`}
                        value={option.text}
                        onChange={(e) => updateOption(index, e.target.value)}
                        fullWidth
                        size="small"
                        required
                      />

                      {form.options.length > 2 && (
                        <IconButton onClick={() => removeOption(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {form.question_type !== QuestionType.true_false && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addOption}
                  sx={{ mt: 1 }}
                >
                  添加选项
                </Button>
              )}
            </Box>

            {/* 题目解析 */}
            <TextField
              label="题目解析"
              multiline
              minRows={3}
              value={form.explanation}
              onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
              error={!!errors.explanation}
              helperText={errors.explanation}
              required
              fullWidth
            />

            {/* 提交按钮 */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/questions')}>
                取消
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? '创建中...' : '创建题目'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </PageContainer>
  );
}
