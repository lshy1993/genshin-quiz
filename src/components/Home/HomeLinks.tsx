import PollIcon from '@mui/icons-material/Poll';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuizIcon from '@mui/icons-material/Quiz';
import { Card, CardActionArea, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function HomeLinks() {
  // 首页快捷入口
  const quickLinks = [
    {
      to: '/votes',
      label: '投票',
      description: '参与投票，表达你的看法',
      icon: <PollIcon fontSize="large" color="primary" />,
    },
    {
      to: '/questions',
      label: '题目库',
      description: '海量题目，随时挑战',
      icon: <QuestionAnswerIcon fontSize="large" color="primary" />,
    },
    {
      to: '/exams',
      label: '测验',
      description: '限时挑战，检验实力',
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
