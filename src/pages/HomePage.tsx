import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UpdateIcon from '@mui/icons-material/Update';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import HomeBanner from '@/components/Home/HomeBanner';
import { HomeLinks } from '@/components/Home/HomeLinks';
import type { Exam } from '../api/dto';
import { useGetHome } from '../api/genshinQuizAPI';
import CategoryChip from '../components/Chip/CategoryChip';
import ContentCardGridSection from '../components/ContentCardGridSection';
import QuestionPreviewCard from '../components/Question/QuestionPreviewCard';
import VotePreviewCard from '../components/Vote/VotePreviewCard';
import { useLanguage } from '../context/LanguageContext';
import { getDifficultyColor, getDifficultyLabel } from '../util/utils';

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
    console.error('Error fetching quizzes:', error);
    return (
      <Alert severity="error">
        <Typography color="error">{t('common.loading_failed')}</Typography>
      </Alert>
    );
  }

  const popularExams: Exam[] = homeData?.popularExams ?? [];
  const latestQuestions = homeData?.latestQuestions ?? [];
  const latestVotes = homeData?.latestVotes ?? [];
  const popularVotes = homeData?.popularVotes ?? [];

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
        {popularVotes.length > 0 && (
          <ContentCardGridSection
            icon={<WhatshotIcon color="error" />}
            title="热门投票"
            action={
              <Button component={Link} to="/votes" size="small" endIcon={<ArrowForwardIcon />}>
                查看更多
              </Button>
            }
            items={popularVotes}
            getKey={(vote) => vote.id}
            renderCard={(vote) => (
              <VotePreviewCard vote={vote} language={currentLanguage} actionLabel="参与投票" />
            )}
          />
        )}
        {/* 热门测验 */}
        {popularExams.length > 0 && (
          <ContentCardGridSection
            icon={<WhatshotIcon color="error" />}
            title="热门测验"
            action={
              <Button component={Link} to="/exams" size="small" endIcon={<ArrowForwardIcon />}>
                查看更多
              </Button>
            }
            items={popularExams}
            getKey={(exam) => exam.id}
            renderCard={(exam) => (
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {exam.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  >
                    {exam.description}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {exam.categories?.map((cat) => (
                      <CategoryChip key={cat} category={cat} />
                    ))}
                    <Chip
                      label={getDifficultyLabel(exam.difficulty)}
                      size="small"
                      color={getDifficultyColor(exam.difficulty)}
                    />
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/exams/${exam.id}`}
                    variant="contained"
                    size="small"
                    fullWidth
                  >
                    开始答题
                  </Button>
                </Box>
              </Card>
            )}
          />
        )}
        {/* 最新题目 */}
        {latestQuestions.length > 0 && (
          <ContentCardGridSection
            icon={<UpdateIcon color="info" />}
            title="最新题目"
            action={
              <Button component={Link} to="/questions" size="small" endIcon={<ArrowForwardIcon />}>
                查看更多
              </Button>
            }
            items={latestQuestions}
            getKey={(question) => question.id}
            renderCard={(question) => (
              <QuestionPreviewCard question={question} actionLabel="查看题目" />
            )}
          />
        )}
        {/* 最新投票 */}
        {latestVotes.length > 0 && (
          <ContentCardGridSection
            icon={<UpdateIcon color="info" />}
            title="最新投票"
            action={
              <Button component={Link} to="/votes" size="small" endIcon={<ArrowForwardIcon />}>
                查看更多
              </Button>
            }
            items={latestVotes}
            getKey={(vote) => vote.id}
            renderCard={(vote) => (
              <VotePreviewCard vote={vote} language={currentLanguage} actionLabel="参与投票" />
            )}
          />
        )}
      </Stack>
    </Box>
  );
}
