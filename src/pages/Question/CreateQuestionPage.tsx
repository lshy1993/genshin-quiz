import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuestionWithAnswer } from '@/api/dto';
import { postCreateQuestion } from '@/api/genshinQuizAPI';
import PageContainer from '@/components/PageContainer';
import { useUser } from '@/context/UserContext';
import { createEmptyQuestionForm, createQuestionSchema } from '@/util/utils';
import CreateQuestionBasicInfo from './CreateQuestionBasicInfo';
import CreateQuestionChoiceInfo from './CreateQuestionChoiceInfo';

export default function CreateQuestionPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  // 表单状态
  const [form, setForm] = useState<QuestionWithAnswer>(
    createEmptyQuestionForm(user?.language ?? 'zh'),
  );
  const [loading, setLoading] = useState(false);
  // 已触摸字段集合
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const { errors, isValid } = useMemo(() => {
    const result = createQuestionSchema.safeParse(form);
    const allFieldErrors: Record<string, string> = {};
    result?.error?.issues.forEach((issue) => {
      const fieldPath = issue.path.join('.');
      allFieldErrors[fieldPath] = issue.message;
    });
    return {
      errors: allFieldErrors,
      isValid: result.success,
    };
  }, [form, touchedFields]);

  // 表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return; // 防止无效提交
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

  // 只显示已触摸字段的错误
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touchedFields.has(field)),
  );

  return (
    <PageContainer>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h3" gutterBottom>
              创建新题目
            </Typography>
            {/* 基本信息 */}
            <CreateQuestionBasicInfo
              form={form}
              setForm={setForm}
              setTouchedField={(changedField) => {
                setTouchedFields((prev) => new Set([...prev, changedField]));
              }}
              errors={visibleErrors}
            />
            {/* 题目内容 */}
            <CreateQuestionChoiceInfo
              form={form}
              setForm={setForm}
              setTouchedField={(changedField) => {
                setTouchedFields((prev) => new Set([...prev, changedField]));
              }}
              removeTouchedField={(removedField) => {
                setTouchedFields((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(removedField);
                  return newSet;
                });
              }}
              errors={visibleErrors}
            />
            {/* 显示验证错误 */}
            {Object.keys(visibleErrors).length > 0 && (
              <Alert severity="error">
                <Typography variant="subtitle2">请修正以下错误：</Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {Object.entries(visibleErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </Alert>
            )}
            {/* 提交按钮 */}
            <Stack direction="row" spacing={3} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/questions')}>
                取消
              </Button>
              <Button type="submit" variant="contained" disabled={!isValid || loading}>
                {loading ? '创建中...' : '创建题目'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </PageContainer>
  );
}
