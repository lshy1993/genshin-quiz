import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postLikeQuestion, useGetQuestion } from '@/api/genshinQuizAPI';
import NextButton from '@/components/Button/NextButton';
import PrevButton from '@/components/Button/PrevButton';
import RandomButton from '@/components/Button/RandomButton';
import PageContainer from '@/components/PageContainer';
import QuestionChoices from '@/components/Question/QuestionChoices';
import QuestionMetaFooter from '@/components/Question/QuestionMetaFooter';
import QuestionMetaHeader from '@/components/Question/QuestionMetaHeader';
import QuestionMySubmission from '@/components/Question/QuestionMySubmission';
import QuestionRecentSubmission from '@/components/Question/QuestionRecentSubmission';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: question, isLoading, error, mutate } = useGetQuestion(id ?? '');
  const [currentTab, setCurrentTab] = useState(0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('Failed to load question:', error);
    return <Alert severity="error">加载题目失败</Alert>;
  }

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

  const handleLike = (likeStatus: 1 | 0 | -1) => {
    postLikeQuestion(question.id, { like: likeStatus })
      .then((_res) => {
        // 点赞后可以刷新题目数据等
        mutate();
      })
      .catch((err) => {
        console.error('Failed to update like status:', err);
      });
  };

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/questions">
          ← 返回题目列表
        </Button>
        <PrevButton tooltip="上一题" onClick={() => {}} />
        <NextButton tooltip="下一题" onClick={() => {}} />
        <RandomButton tooltip="随机一题" onClick={() => {}} />
      </Box>
      <Card>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="描述" />
          <Tab label="提交记录" />
        </Tabs>
        {currentTab === 0 && (
          <CardContent>
            <Stack spacing={2} divider={<Divider flexItem />}>
              <QuestionMetaHeader question={question} />
              <QuestionChoices question={question} mutate={mutate} />
              <QuestionMetaFooter question={question} handleLike={handleLike} />
            </Stack>
          </CardContent>
        )}
        {currentTab === 1 && (
          <CardContent>
            <QuestionMySubmission questionId={question.id} options={question.options} />
            <QuestionRecentSubmission questionId={question.id} />
          </CardContent>
        )}
      </Card>
    </PageContainer>
  );
}
