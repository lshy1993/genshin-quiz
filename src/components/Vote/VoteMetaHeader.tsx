import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import type { User, Vote } from '@/api/dto';
import CategoryChip from '@/components/CategoryChip';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumberShort } from '@/util/utils';

interface Props {
  voteInfo: Vote;
  user: User | null;
}

export default function VoteMetaHeader({ voteInfo, user }: Props) {
  const { currentLanguage } = useLanguage();
  const hasVoted = voteInfo.voted || (voteInfo.voted_options && voteInfo.voted_options.length > 0);
  const isOwner = !!user && voteInfo.created_by === user.uuid;

  function getCountdownText(start: Date, end?: Date) {
    const now = DateTime.now();
    const startDt = DateTime.fromJSDate(start);
    const endDt = end ? DateTime.fromJSDate(end) : undefined;
    if (endDt && now > endDt) return '已结束';
    if (now < startDt) return '未开始';
    if (endDt) {
      const diff = endDt.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
      if (diff.days && diff.days > 0) return `${Math.floor(diff.days)}天`;
      if (diff.hours && diff.hours > 0) return `${Math.floor(diff.hours)}小时`;
      if (diff.minutes && diff.minutes > 0) return `${Math.floor(diff.minutes)}分钟`;
      return '即将结束';
    }
    return '无限期';
  }

  const renderCountdown = (start: Date, end: Date) => {
    return (
      <Tooltip
        title={`${end ? DateTime.fromJSDate(end).toFormat('yyyy-MM-dd HH:mm') : '无限期'}`}
        placement="bottom-start"
        arrow
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <AccessTimeIcon fontSize="small" />
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: 'text.secondary',
            }}
          >
            {getCountdownText(start, end)}
          </Typography>
        </Stack>
      </Tooltip>
    );
  };

  const renderParticipants = () => {
    const participants = voteInfo.participants ?? 0;
    return (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
        }}
      >
        <Tooltip title="总参与人数">
          <PeopleAltIcon fontSize="small" />
        </Tooltip>
        <Tooltip title={participants}>
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: 'text.secondary',
            }}
          >
            {formatNumberShort(participants)}
          </Typography>
        </Tooltip>
      </Stack>
    );
  };

  const renderTotalVotes = () => {
    const total = voteInfo.total_votes ?? 0;
    return (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
        }}
      >
        <Tooltip title="总票数">
          <HowToVoteIcon fontSize="small" />
        </Tooltip>
        <Tooltip title={total}>
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: 'text.secondary',
            }}
          >
            {formatNumberShort(total)}
          </Typography>
        </Tooltip>
      </Stack>
    );
  };

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
          {voteInfo.expire_at && renderCountdown(voteInfo.start_at, voteInfo.expire_at)}
        </Stack>
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          {renderParticipants()}
          {renderTotalVotes()}
        </Stack>
      </Box>
    </Stack>
  );
}
