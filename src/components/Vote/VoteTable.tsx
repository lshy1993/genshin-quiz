import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Vote } from '@/api/dto';
import CategoryChip from '@/components/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

interface VoteTableProps {
  votes: Vote[];
}

export default function VoteTable({ votes }: VoteTableProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { user } = useUser();

  if (votes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
          }}
        >
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
    <Stack direction="column" spacing={2}>
      {votes.map((vote) => {
        const hasVoted = vote.voted || (vote.voted_options && vote.voted_options.length > 0);
        const isOwner = !!user && vote.created_by === user.uuid;
        return (
          <Card key={vote.id}>
            <CardActionArea onClick={() => navigate(`/votes/${vote.id}`)}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {vote.category && <CategoryChip category={vote.category} />}
                  <Chip
                    label={vote.votes_per_user === 1 ? '单选' : `多选(${vote.votes_per_user}票)`}
                    size="small"
                    variant="outlined"
                    color="default"
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {getVoteTitle(vote)}
                  </Typography>
                  {hasVoted && (
                    <Tooltip title="你已参与此投票">
                      <CheckCircleIcon fontSize="small" color="success" />
                    </Tooltip>
                  )}
                  {isOwner && (
                    <Tooltip title="我创建的投票">
                      <EditIcon fontSize="small" color="action" />
                    </Tooltip>
                  )}
                </Box>
                <Box
                  sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}
                >
                  {vote.expire_at && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      截止：{renderTime(vote.expire_at)}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color={getStatusColor(vote)}
                    sx={{
                      fontWeight: 'medium',
                    }}
                  >
                    {getRemainingTime(vote.expire_at)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: hasVoted ? 'success.main' : 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      参与：{vote.participants ?? 0}人
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
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
        );
      })}
    </Stack>
  );
}
