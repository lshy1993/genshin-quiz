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
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import type { Poll } from '@/api/dto';
import CategoryChip from '@/components/Chip/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { routes } from '@/route/route';
import { getCountdownText, getLocalizedText } from '@/util/utils';

interface VoteTableProps {
  votes: Poll[];
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
          {t('poll_list.empty')}
        </Typography>
      </Box>
    );
  }

  const renderTime = (date: Date | undefined) => {
    if (!date) return '-';
    return date.toLocaleString(currentLanguage);
  };

  const getRemainingTime = (expireDate: Date | undefined) => {
    if (!expireDate) return t('poll_list.permanent');
    return t('poll_list.remaining', { time: getCountdownText(expireDate) });
  };

  const getStatusColor = (vote: Poll) => {
    if (!vote.expire_at) return 'primary.main';
    const expired = vote.expire_at ? vote.expire_at < new Date() : false;
    if (expired) return 'error';
    return 'success.main';
  };

  return (
    <Stack direction="column" spacing={2}>
      {votes.map((vote) => {
        const hasVoted = vote.my_votes && vote.my_votes.length > 0;
        const isOwner = !!user && vote.created_by === user.uuid;
        return (
          <Card key={vote.id}>
            <CardActionArea onClick={() => navigate(routes.poll(vote.id))}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {vote.category && <CategoryChip category={vote.category} />}
                  <Chip
                    label={
                      vote.votes_per_user === 1
                        ? t('poll_list.single_choice')
                        : t('poll_list.multiple_choice', { count: vote.votes_per_user })
                    }
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
                    {getLocalizedText(vote.title, currentLanguage)}
                  </Typography>
                  {hasVoted && (
                    <Tooltip title={t('poll_list.already_voted')}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </Tooltip>
                  )}
                  {isOwner && (
                    <Tooltip title={t('poll_list.created_by_me')}>
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
                      {t('poll_list.deadline', { time: renderTime(vote.expire_at) })}
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
                      {t('poll_list.participants', { count: vote.participants_count })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {t('poll_list.total_votes', { count: vote.total_votes_count })}
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
