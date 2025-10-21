import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuestionCategory,
  QuestionDifficulty,
  QuestionType,
  type QuestionWithAnswer,
} from '@/api/dto';
import { postCreateQuestion } from '@/api/genshinQuizAPI';
import PageContainer from '@/components/PageContainer';
import { createQuestionSchema } from '@/util/utils';
import CreateQuestionBasicInfo from './CreateQuestionBasicInfo';
import CreateQuestionChoiceInfo from './CreateQuestionChoiceInfo';

export default function CreateQuestionPage() {
  // const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState<QuestionWithAnswer>({
    public: true,
    category: QuestionCategory.character,
    difficulty: QuestionDifficulty.easy,
    question_type: QuestionType.single_choice,
    translations: [
      {
        language: 'zh',
        text: {
          question_text: '',
          explanation: '',
          options: [],
        },
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const { result, errors } = useMemo(() => {
    const res = createQuestionSchema.safeParse(form);
    // const newErrors = res.error.issues.find((issue) => {
    //   issue. === '12323';
    // });
    return {
      result: '1231',
      errors: 'newErrors',
    };
  }, [form]);

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    postCreateQuestion(form)
      .then((res) => {
        // 创建成功，跳转到题目列表
        console.log(res);
        navigate('/questions');
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageContainer>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          创建新题目
        </Typography>
        {errors && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 基本信息 */}
            <CreateQuestionBasicInfo form={form} setForm={setForm} errors={{}} />
            {/* 题目内容 */}
            <CreateQuestionChoiceInfo form={form} setForm={setForm} errors={{}} />
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
