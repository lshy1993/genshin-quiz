import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Poll } from '@/api/dto';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedText } from '@/util/utils';
import ExpiredTimeChip from '../Chip/ExpiredTimeChip';
import LikesChip from '../Chip/LikesChip';
import UsersChip from '../Chip/UsersChip';
import VotesChip from '../Chip/VotesChip';

interface PollPreviewCardProps {
  poll: Poll;
  actionLabel?: string;
}

export default function PollPreviewCard({ poll, actionLabel }: PollPreviewCardProps) {
  const { currentLanguage } = useLanguage();
  const targetTo = `/polls/${poll.id}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography>{getLocalizedText(poll.title, currentLanguage)}</Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {getLocalizedText(poll.description, currentLanguage)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <VotesChip votes={poll.total_votes_count} />
            <UsersChip participants={poll.participants_count} />
            <LikesChip likes={poll.likes_count} />
          </Stack>
          <ExpiredTimeChip start={poll.start_at} end={poll.expire_at} />
        </Box>
        {actionLabel && (
          <Button component={Link} to={targetTo} variant="contained" size="small" fullWidth>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
