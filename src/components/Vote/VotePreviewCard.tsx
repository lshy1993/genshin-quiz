import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Vote } from '@/api/dto';
import ExpiredTimeChip from '../Chip/ExpiredTimeChip';
import LikesChip from '../Chip/LikesChip';
import UsersChip from '../Chip/UsersChip';
import VotesChip from '../Chip/VotesChip';

interface VotePreviewCardProps {
  vote: Vote;
  language: string;
  linkTo?: string;
  actionLabel?: string;
}

export default function VotePreviewCard({
  vote,
  language,
  linkTo,
  actionLabel,
}: VotePreviewCardProps) {
  const targetTo = linkTo ?? `/votes/${vote.id}`;

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
        <Box>
          <Typography>{vote.title[language]}</Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {vote.description?.[language]}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <VotesChip votes={vote.total_votes ?? 0} />
            <UsersChip participants={vote.participants ?? 0} />
            <LikesChip likes={vote.likes ?? 0} />
          </Stack>
          <ExpiredTimeChip start={vote.start_at} end={vote.expire_at} />
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
