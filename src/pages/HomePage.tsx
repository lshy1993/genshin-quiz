import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PollIcon from '@mui/icons-material/Poll';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuizIcon from '@mui/icons-material/Quiz';
import UpdateIcon from '@mui/icons-material/Update';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Exam } from '../api/dto';
import { useGetExams, useGetQuestions, useGetVotes } from '../api/genshinQuizAPI';
import CategoryChip from '../components/CategoryChip';
import { useLanguage } from '../context/LanguageContext';
import { getDifficultyColor, getDifficultyLabel } from '../util/utils';

// 首页快捷入口
const quickLinks = [
  {
    to: '/questions',
    label: '题目库',
    description: '海量题目，随时挑战',
    icon: <QuestionAnswerIcon fontSize="large" color="primary" />,
  },
  {
    to: '/votes',
    label: '投票',
    description: '参与投票，表达你的看法',
    icon: <PollIcon fontSize="large" color="primary" />,
  },
  {
    to: '/exams',
    label: '测验',
    description: '限时挑战，检验实力',
    icon: <QuizIcon fontSize="large" color="primary" />,
  },
];

// 内容区块的统一标题：图标 + 标题 + “查看更多”
function SectionHeader({
  icon,
  title,
  viewAllTo,
}: {
  icon: ReactNode;
  title: string;
  viewAllTo: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Stack>
      <Button component={Link} to={viewAllTo} size="small" endIcon={<ArrowForwardIcon />}>
        查看更多
      </Button>
    </Box>
  );
}

export default function HomePage() {
  const { currentLanguage } = useLanguage();
  const {
    data: examRes,
    isLoading,
    error,
  } = useGetExams({
    page: 1,
    limit: 3,
    sortBy: 'likes',
    sortDesc: true,
  });
  const { data: questionRes } = useGetQuestions({
    page: 1,
    limit: 3,
    language: [currentLanguage],
    sortBy: 'created_at',
    sortDesc: true,
  });
  const { data: voteRes } = useGetVotes({
    page: 1,
    limit: 3,
    language: [currentLanguage],
    sortBy: 'created_at',
    sortDesc: true,
  });
  const { data: popularVoteRes } = useGetVotes({
    page: 1,
    limit: 3,
    language: [currentLanguage],
    sortBy: 'likes',
    sortDesc: true,
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

  const popularExams: Exam[] = examRes?.exams ?? [];
  const latestQuestions = questionRes?.questions ?? [];
  const latestVotes = voteRes?.votes ?? [];
  const popularVotes = popularVoteRes?.votes ?? [];

  const getVoteTitle = (title: Record<string, string>) => {
    return title[currentLanguage] || title[Object.keys(title)[0]] || '';
  };

  return (
    <Stack spacing={6}>
      {/* 欢迎区域 */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 2,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          原神知识测验
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          测试你对原神世界的了解程度，参与投票，挑战限时测验
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/questions"
            variant="contained"
            color="secondary"
            size="large"
          >
            浏览题目
          </Button>
          <Button
            component={Link}
            to="/about"
            variant="outlined"
            size="large"
            sx={{ color: 'inherit', borderColor: 'currentColor' }}
          >
            了解更多
          </Button>
        </Stack>
      </Box>

      {/* 快捷入口 */}
      <Grid container spacing={3}>
        {quickLinks.map((link) => (
          <Grid key={link.to} size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardActionArea component={Link} to={link.to} sx={{ p: 3, textAlign: 'center' }}>
                {link.icon}
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {link.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {link.description}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 热门测验 */}
      {popularExams.length > 0 && (
        <Box>
          <SectionHeader
            icon={<WhatshotIcon color="error" />}
            title="热门测验"
            viewAllTo="/exams"
          />
          <Grid container spacing={3}>
            {popularExams.map((exam) => (
              <Grid key={exam.id} size={{ xs: 12, md: 4 }}>
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
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* 热门投票 */}
      {popularVotes.length > 0 && (
        <Box>
          <SectionHeader
            icon={<WhatshotIcon color="error" />}
            title="热门投票"
            viewAllTo="/votes"
          />
          <Grid container spacing={3}>
            {popularVotes.map((vote) => (
              <Grid key={vote.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {getVoteTitle(vote.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      {vote.description ? getVoteTitle(vote.description) : ''}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/votes/${vote.id}`}
                      variant="contained"
                      size="small"
                      fullWidth
                    >
                      参与投票
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* 最新题目 */}
      {latestQuestions.length > 0 && (
        <Box>
          <SectionHeader
            icon={<UpdateIcon color="info" />}
            title="最新题目"
            viewAllTo="/questions"
          />
          <Grid container spacing={3}>
            {latestQuestions.map((question) => (
              <Grid key={question.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {question.question_text}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      <CategoryChip category={question.category} />
                      <Chip
                        label={getDifficultyLabel(question.difficulty)}
                        size="small"
                        color={getDifficultyColor(question.difficulty)}
                      />
                    </Stack>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/questions/${question.id}`}
                      variant="contained"
                      size="small"
                      fullWidth
                    >
                      查看题目
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* 最新投票 */}
      {latestVotes.length > 0 && (
        <Box>
          <SectionHeader icon={<UpdateIcon color="info" />} title="最新投票" viewAllTo="/votes" />
          <Grid container spacing={3}>
            {latestVotes.map((vote) => (
              <Grid key={vote.id} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {getVoteTitle(vote.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      {vote.description ? getVoteTitle(vote.description) : ''}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/votes/${vote.id}`}
                      variant="contained"
                      size="small"
                      fullWidth
                    >
                      参与投票
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}
