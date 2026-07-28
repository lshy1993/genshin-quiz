import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CreateQuestionRequest } from '@/api/dto';
import { postCreateQuestion } from '@/api/genshinQuizAPI';
import PageContainer from '@/components/PageContainer';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/route/route';
import { createEmptyQuestionForm } from '@/util/utils';
import { createQuestionSchema } from '@/util/zod';
import CreateQuestionBasicInfo from './CreateQuestionBasicInfo';
import CreateQuestionChoiceInfo from './CreateQuestionChoiceInfo';

export default function CreateQuestionPage() {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  // 表单状态
  const [form, setForm] = useState<CreateQuestionRequest>(createEmptyQuestionForm(currentLanguage));
  const [loading, setLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
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
    setSubmitAttempted(true);
    // 防止无效提交
    const result = createQuestionSchema.safeParse(form);
    if (!result.success) {
      return;
    }
    // 正式提交给服务器
    setLoading(true);
    postCreateQuestion(form)
      .then((_res) => {
        // 创建成功，跳转到题目列表
        navigate(routes.questions());
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('创建问题失败', {
          variant: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function prettyFieldName(path: string) {
    const parts = path.split('.');

    if (parts[0] === 'options') {
      return `第 ${Number(parts[1]) + 1} 个选项`;
    }

    if (parts[0] === 'question_text') {
      return '题干';
    }

    if (parts[0] === 'explanation') {
      return '解释';
    }

    return path;
  }

  // 只显示已触摸字段的错误
  const visibleErrors = submitAttempted
    ? errors
    : Object.fromEntries(Object.entries(errors).filter(([field]) => touchedFields.has(field)));

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/questions">
          ← 返回题目列表
        </Button>
      </Box>
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
                    <li key={field}>
                      {prettyFieldName(field)}: {message}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
            {/* 提交按钮 */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="outlined" onClick={() => navigate(routes.questions())}>
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
