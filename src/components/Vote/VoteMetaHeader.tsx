import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import type { User, Vote } from '@/api/dto';
import CategoryChip from '@/components/Chip/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';
import ExpiredTimeChip from '../Chip/ExpiredTimeChip';
import UsersChip from '../Chip/UsersChip';
import VotesChip from '../Chip/VotesChip';

interface Props {
  voteInfo: Vote;
  user: User | null;
}

export default function VoteMetaHeader({ voteInfo, user }: Props) {
  const { currentLanguage } = useLanguage();
  const hasVoted = voteInfo.voted || (voteInfo.voted_options && voteInfo.voted_options.length > 0);
  const isOwner = !!user && voteInfo.created_by === user.uuid;

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
          }}
        >
          {voteInfo.title[currentLanguage]}
        </Typography>
        {hasVoted && (
          <Tooltip title="你已参与此投票">
            <CheckCircleIcon color="success" />
          </Tooltip>
        )}
        {isOwner && (
          <Tooltip title="我创建的投票">
            <EditIcon color="action" />
          </Tooltip>
        )}
        {/* 预留给自定义tag */}
        {/* <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {voteInfo.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box> */}
      </Stack>
      <Typography
        variant="subtitle1"
        sx={{
          color: 'text.secondary',
        }}
      >
        {voteInfo.description?.[currentLanguage]}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <CategoryChip category={voteInfo.category} />
          <ExpiredTimeChip start={voteInfo.start_at} end={voteInfo.expire_at} />
        </Stack>
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <UsersChip participants={voteInfo.participants ?? 0} />
          <VotesChip votes={voteInfo.total_votes ?? 0} />
        </Stack>
      </Box>
    </Stack>
  );
}
