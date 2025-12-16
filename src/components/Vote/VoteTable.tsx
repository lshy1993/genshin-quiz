import { Box, Card, CardActionArea, CardContent, Chip, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Vote } from '@/api/dto';
import CategoryChip from '@/components/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';

interface VoteTableProps {
  votes: Vote[];
}

export default function VoteTable({ votes }: VoteTableProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  if (votes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          暂无正在进行中的投票
        </Typography>
      </Box>
    );
  }

  const getVoteTitle = (vote: Vote) => {
    const defaultLang = Object.keys(vote.title)[0];
    return vote.title[currentLanguage] || vote.title[defaultLang];
  };

  const renderTime = (date: Date | undefined) => {
    if (!date) return '-';
    return date.toLocaleString();
  };

  const getRemainingTime = (expireDate: Date | undefined) => {
    if (!expireDate) return '永久有效';
    const now = new Date();
    const diff = expireDate.getTime() - now.getTime();

    if (diff < 0) return '已结束';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `剩余${days}天${hours}小时`;
    if (hours > 0) return `剩余${hours}小时${minutes}分钟`;
    return `剩余${minutes}分钟`;
  };

  const getStatusColor = (vote: Vote) => {
    if (!vote.expire_at) return 'primary.main';
    if (vote.expired) return 'error';
    return 'success.main';
  };

  return (
    <Grid container direction="column" spacing={2}>
      {votes.map((vote) => (
        <Card key={vote.id}>
          <CardActionArea onClick={() => navigate(`/votes/${vote.id}`)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {vote.category && <CategoryChip category={vote.category} />}
                <Typography variant="h6" fontWeight="bold">
                  {getVoteTitle(vote)}
                </Typography>
                <Chip
                  label={vote.votes_per_user === 1 ? '单选' : `多选(${vote.votes_per_user}票)`}
                  size="small"
                  variant="outlined"
                  color="default"
                />
                {vote.voted_options && vote.voted_options.length > 0 && (
                  <Chip label="已参与" color="success" size="small" variant="outlined" />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {vote.expire_at && (
                  <Typography variant="body2" color="text.secondary">
                    截止：{renderTime(vote.expire_at)}
                  </Typography>
                )}
                <Typography variant="body2" color={getStatusColor(vote)} fontWeight="medium">
                  {getRemainingTime(vote.expire_at)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    参与：{vote.participants ?? 0}人
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总票：{vote.total_votes ?? 0}票
                  </Typography>
                </Box>
              </Box>
              {vote.tags && vote.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {vote.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Grid>
  );
}
