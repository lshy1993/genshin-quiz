import PollIcon from '@mui/icons-material/Poll';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuizIcon from '@mui/icons-material/Quiz';
import { Card, CardActionArea, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';

export function HomeLinks() {
  // 首页快捷入口
  const quickLinks = [
    {
      to: '/polls',
      label: t('home.vote'),
      description: t('home.vote_description'),
      icon: <PollIcon fontSize="large" color="primary" />,
    },
    {
      to: '/questions',
      label: t('home.question_bank'),
      description: t('home.question_description'),
      icon: <QuestionAnswerIcon fontSize="large" color="primary" />,
    },
    {
      to: '/exams',
      label: t('home.quiz'),
      description: t('home.quiz_description'),
      icon: <QuizIcon fontSize="large" color="primary" />,
    },
  ];

  return (
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
  );
}
