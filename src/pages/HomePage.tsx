import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UpdateIcon from '@mui/icons-material/Update';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import ExamPreviewCard from '@/components/Exam/ExamPreviewCard';
import HomeBanner from '@/components/Home/HomeBanner';
import { HomeLinks } from '@/components/Home/HomeLinks';
import type { Exam } from '../api/dto';
import { useGetHome } from '../api/genshinQuizAPI';
import ContentCardGridSection from '../components/ContentCardGridSection';
import QuestionPreviewCard from '../components/Question/QuestionPreviewCard';
import PollPreviewCard from '../components/Vote/PollPreviewCard';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { currentLanguage } = useLanguage();
  const {
    data: homeData,
    isLoading,
    error,
  } = useGetHome({
    language: currentLanguage,
  });

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    console.error('Error fetching home data:', error);
    return (
      <Alert severity="error">
        <Typography color="error">{t('common.loading_failed')}</Typography>
      </Alert>
    );
  }

  const popularExams: Exam[] = homeData?.popularExams ?? [];
  const latestQuestions = homeData?.latestQuestions ?? [];
  const latestPolls = homeData?.latestPolls ?? [];
  const popularPolls = homeData?.popularPolls ?? [];

  return (
    <Box
      sx={{ width: '100%', maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}
    >
      <Stack spacing={3}>
        {/* 欢迎区域 */}
        <HomeBanner />
        {/* 快捷入口 */}
        <HomeLinks />
        {/* 热门投票 */}
        {popularPolls.length > 0 && (
          <ContentCardGridSection
            icon={<WhatshotIcon color="error" />}
            title={t('home.polls')}
            action={
              <Button component={Link} to="/polls" size="small" endIcon={<ArrowForwardIcon />}>
                {t('common.btn_label.view_more')}
              </Button>
            }
            items={popularPolls}
            getKey={(poll) => poll.id}
            renderCard={(poll) => <PollPreviewCard poll={poll} actionLabel={t('home.participate_poll')} />}
          />
        )}
        {/* 热门测验 */}
        {popularExams.length > 0 && (
          <ContentCardGridSection
            icon={<WhatshotIcon color="error" />}
            title={t('home.exams')}
            action={
              <Button component={Link} to="/exams" size="small" endIcon={<ArrowForwardIcon />}>
                {t('common.btn_label.view_more')}
              </Button>
            }
            items={popularExams}
            getKey={(exam) => exam.id}
            renderCard={(exam) => <ExamPreviewCard exam={exam} actionLabel={t('home.participate_poll')} />}
          />
        )}
        {/* 最新题目 */}
        {latestQuestions.length > 0 && (
          <ContentCardGridSection
            icon={<UpdateIcon color="info" />}
            title={t('home.latest_questions')}
            action={
              <Button component={Link} to="/questions" size="small" endIcon={<ArrowForwardIcon />}>
                {t('common.btn_label.view_more')}
              </Button>
            }
            items={latestQuestions}
            getKey={(question) => question.id}
            renderCard={(question) => (
              <QuestionPreviewCard question={question} actionLabel={t('home.view_question')} />
            )}
          />
        )}
        {/* 最新投票 */}
        {latestPolls.length > 0 && (
          <ContentCardGridSection
            icon={<UpdateIcon color="info" />}
            title={t('home.latest_polls')}
            action={
              <Button component={Link} to="/polls" size="small" endIcon={<ArrowForwardIcon />}>
                {t('common.btn_label.view_more')}
              </Button>
            }
            items={latestPolls}
            getKey={(poll) => poll.id}
            renderCard={(poll) => <PollPreviewCard poll={poll} actionLabel={t('home.participate_poll')} />}
          />
        )}
      </Stack>
    </Box>
  );
}
