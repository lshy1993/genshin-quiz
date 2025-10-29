import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetQuestion } from '@/api/genshinQuizAPI';
import PageContainer from '@/components/PageContainer';
import QuestionChoices from '@/components/Question/QuestionChoices';
import QuestionMetaFooter from '@/components/Question/QuestionMetaFooter';
import QuestionMetaHeader from '@/components/Question/QuestionMetaHeader';
import QuestionMySubmission from '@/components/Question/QuestionMySubmission';
import { mockQuestionAnswers, type QuestionSubmission } from '@/util/mock';
import { areAnswersEqual } from '@/util/utils';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  // 这里用 mock 数据，实际可用 useGetQuestion(id)
  const { data: question } = useGetQuestion(id ?? '');
  const [currentTab, setCurrentTab] = useState(0);
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

  // mock 提交处理 （实际应调用提交接口）
  const handleSubmit = (selectedOptions: string[]) => {
    // 正确答案（假设用 options 的 id，实际应从 question.answers 获取）
    const answers = mockQuestionAnswers.find((a) => a.question_id === question.id)?.answers ?? [];
    // 三种题型直接比对set是否一致
    const isCorrect = areAnswersEqual(answers, selectedOptions);
    // mock 返回数据更新
    // setQuestion((q) => {
    //   return {
    //     ...q,
    //     solved: isCorrect,
    //     answers: answers,
    //   };
    // });
    setSubmissionList((list) => [
      ...list,
      {
        user_name: '',
        selected: [...selectedOptions],
        correct: isCorrect,
        submitted_at: DateTime.now(),
      },
    ]);
  };

  const handleLike = (_likeStatus: 1 | 0 | -1) => {
    // mock 更新数据，实际应调用接口
    // setQuestion((q) => {
    //   return {
    //     ...q,
    //     likeStatus: likeStatus,
    //   };
    // });
  };

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/questions">
          ← 返回题目列表
        </Button>
        <Tooltip title="上一题">
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="下一题">
          <IconButton>
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="随机一题">
          <IconButton>
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
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
              <QuestionChoices question={question} handleSubmit={handleSubmit} />
              <QuestionMetaFooter question={question} handleLike={handleLike} />
            </Stack>
          </CardContent>
        )}
        {currentTab === 1 && (
          <CardContent>
            <QuestionMySubmission submissionList={submissionList} options={question.options} />
          </CardContent>
        )}
      </Card>
    </PageContainer>
  );
}
