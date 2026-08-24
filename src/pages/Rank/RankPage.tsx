import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import QuizIcon from '@mui/icons-material/Quiz';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserPublic } from '@/api/dto';
import { useGetUsers } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import { useUser } from '@/context/UserContext';
import { routes } from '@/route/route';
import { formatNumberShort, getWilsonScoreLowerBound } from '@/util/utils';

// 每隔多久自动刷新一次排行榜
const REFRESH_INTERVAL_MS = 15000;
// 每个榜单展示前几名
const TOP_N = 10;
// 前三名的奖牌配色：金/银/铜
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

interface RankEntry {
  user: UserPublic;
  primaryText: string;
  secondaryText?: string;
}

function RankColumn({
  icon,
  title,
  caption,
  entries,
  currentUserId,
  onEntryClick,
}: {
  icon: ReactNode;
  title: string;
  caption?: string;
  entries: RankEntry[];
  currentUserId?: string;
  onEntryClick: (entry: RankEntry) => void;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Stack>
        {caption && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            {caption}
          </Typography>
        )}
        {entries.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
            {t('common.label.no_data')}
          </Typography>
        ) : (
          <Stack spacing={0.5} sx={{ mt: 2 }}>
            {entries.map((entry, index) => (
              <Box
                key={entry.user.uuid}
                onClick={() => onEntryClick(entry)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  bgcolor: entry.user.uuid === currentUserId ? 'action.selected' : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: MEDAL_COLORS[index] ?? 'text.secondary',
                  }}
                >
                  {index + 1}
                </Box>
                <Avatar src={entry.user.avatar_url} sx={{ width: 32, height: 32 }}>
                  {entry.user.nickname.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 'medium' }}>
                    {entry.user.nickname}
                  </Typography>
                  {entry.secondaryText && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {entry.secondaryText}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: 'primary.main', whiteSpace: 'nowrap' }}
                >
                  {entry.primaryText}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default function RankPage() {
  const { user: currentUser } = useUser();
  const navigate = useNavigate();
  // 拉取用户列表并定时刷新，实现“实时”排名效果
  const { data, isLoading, error } = useGetUsers(
    { limit: 100, offset: 0 },
    { swr: { refreshInterval: REFRESH_INTERVAL_MS, revalidateOnFocus: true } },
  );

  const handleEntryClick = (entry: RankEntry) => {
    navigate(routes.user(entry.user.uuid));
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error('Failed to load rank:', error);
    return <Alert severity="error">{t('rank.load_failed')}</Alert>;
  }

  const users = data?.users ?? [];

  // 答题正确率榜：用 Wilson 置信区间下界排序，兼顾正确率与答题数量
  const accuracyEntries: RankEntry[] = users
    .filter((u) => u.total_answers > 0)
    .map((u) => ({ user: u, score: getWilsonScoreLowerBound(u.correct_answers, u.total_answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_N)
    .map(({ user, score }) => ({
      user,
      primaryText: `${(score * 100).toFixed(1)}%`,
      secondaryText: t('rank.accuracy_stats', {
        total: formatNumberShort(user.total_answers),
        correct: formatNumberShort(user.correct_answers),
      }),
    }));

  // 投票达人榜：按参与投票数排序
  const voteEntries: RankEntry[] = users
    .filter((u) => u.polls_created > 0)
    .sort((a, b) => b.polls_created - a.polls_created)
    .slice(0, TOP_N)
    .map((user) => ({
      user,
      primaryText: t('rank.poll_count', { count: formatNumberShort(user.polls_created) }),
    }));

  // 创作达人榜：按创建题目数排序
  const creatorEntries: RankEntry[] = users
    .filter((u) => u.questions_created > 0)
    .sort((a, b) => b.questions_created - a.questions_created)
    .slice(0, TOP_N)
    .map((user) => ({
      user,
      primaryText: t('rank.question_count', { count: formatNumberShort(user.questions_created) }),
    }));

  return (
    <PageContainer>
      <BannerBox
        title={t('rank.title')}
        subtitle={t('rank.refresh_interval', { seconds: REFRESH_INTERVAL_MS / 1000 })}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <RankColumn
            icon={<EmojiEventsIcon color="warning" />}
            title={t('rank.accuracy_title')}
            caption={t('rank.accuracy_caption')}
            entries={accuracyEntries}
            currentUserId={currentUser?.uuid}
            onEntryClick={handleEntryClick}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RankColumn
            icon={<HowToVoteIcon color="primary" />}
            title={t('rank.poll_title')}
            entries={voteEntries}
            currentUserId={currentUser?.uuid}
            onEntryClick={handleEntryClick}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RankColumn
            icon={<QuizIcon color="secondary" />}
            title={t('rank.creator_title')}
            caption={t('rank.creator_caption')}
            entries={creatorEntries}
            currentUserId={currentUser?.uuid}
            onEntryClick={handleEntryClick}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
