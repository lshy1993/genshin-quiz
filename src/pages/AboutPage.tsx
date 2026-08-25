import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import QuizIcon from '@mui/icons-material/Quiz';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import { routes } from '@/route/route';

const features = [
  {
    icon: <QuizIcon color="primary" />,
    titleKey: 'questions_title',
    descriptionKey: 'questions_desc',
  },
  {
    icon: <HowToVoteIcon color="primary" />,
    titleKey: 'polls_title',
    descriptionKey: 'polls_desc',
  },
  {
    icon: <LeaderboardIcon color="primary" />,
    titleKey: 'community_title',
    descriptionKey: 'community_desc',
  },
] as const;

export default function AboutPage() {
  return (
    <PageContainer>
      <Stack spacing={4}>
        <BannerBox title={t('about.title')} subtitle={t('about.subtitle')} />

        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          {t('about.introduction')}
        </Typography>

        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            {t('about.features_title')}
          </Typography>
          <Grid container spacing={2}>
            {features.map(({ icon, titleKey, descriptionKey }) => (
              <Grid key={titleKey} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    {icon}
                    <Typography variant="h6" component="h3" sx={{ mt: 1, mb: 0.5 }}>
                      {t(`about.${titleKey}`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`about.${descriptionKey}`)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('about.get_started_title')}
          </Typography>
          <Typography component="ol" sx={{ m: 0, pl: 3, color: 'text.secondary', lineHeight: 2 }}>
            <li>{t('about.step_one')}</li>
            <li>{t('about.step_two')}</li>
            <li>{t('about.step_three')}</li>
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={Link} to={routes.questions()} variant="contained" size="large">
            {t('about.browse_questions')}
          </Button>
          <Button component={Link} to={routes.polls()} variant="outlined" size="large">
            {t('about.browse_polls')}
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
