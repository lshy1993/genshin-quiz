import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import type { Vote } from '@/api/dto';
import { formatNumberShort, getCategoryLabel } from '@/util/utils';

interface Props {
  voteInfo: Vote;
}

export default function VoteMetaHeader({ voteInfo }: Props) {
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
        <Stack direction="row" spacing={0.5} alignItems="center">
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary" align="right">
            {getCountdownText(start, end)}
          </Typography>
        </Stack>
      </Tooltip>
    );
  };

  const renderParticipants = () => {
    const participants = voteInfo.participants ?? 0;
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="总参与人数">
          <PeopleAltIcon fontSize="small" />
        </Tooltip>
        <Tooltip title={participants}>
          <Typography variant="body2" color="text.secondary" align="right">
            {formatNumberShort(participants)}
          </Typography>
        </Tooltip>
      </Stack>
    );
  };

  const renderTotalVotes = () => {
    const total = voteInfo.total_votes ?? 0;
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="总票数">
          <HowToVoteIcon fontSize="small" />
        </Tooltip>
        <Tooltip title={total}>
          <Typography variant="body2" color="text.secondary" align="right">
            {formatNumberShort(total)}
          </Typography>
        </Tooltip>
      </Stack>
    );
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h4" fontWeight="bold">
          {voteInfo.title}
        </Typography>
        {/* 预留给自定义tag */}
        {/* <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {voteInfo.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box> */}
      </Stack>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Chip size="small" label={getCategoryLabel(voteInfo.category)} />
          {voteInfo.expires_at && renderCountdown(voteInfo.start_at, voteInfo.expires_at)}
        </Stack>
        <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          {renderParticipants()}
          {renderTotalVotes()}
        </Stack>
      </Box>
    </Stack>
  );
}
