import PollIcon from '@mui/icons-material/Poll';
import QuizIcon from '@mui/icons-material/Quiz';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import { useGetUser, useGetUserPolls, useGetUserQuestions } from '@/api/genshinQuizAPI';
import ContentCardGridSection from '@/components/ContentCardGridSection';
import PageContainer from '@/components/PageContainer';
import QuestionPreviewCard from '@/components/Question/QuestionPreviewCard';
import ChangePasswordForm from '@/components/User/ChangePasswordForm';
import EditProfileForm from '@/components/User/EditProfileForm';
import VotePreviewCard from '@/components/Vote/PollPreviewCard';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { formatNumberShort } from '@/util/utils';

// 每个列表最多展示的条目数
const LIST_LIMIT = 10;

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useUser();
  const { currentLanguage } = useLanguage();

  if (!id) {
    throw new Error('Missing route parameter: id');
  }

  const isMe = me?.uuid === id;
  const userQuery = useGetUser(id, {
    swr: {
      enabled: !isMe,
    },
  });
  const questionQuery = useGetUserQuestions(id);
  const pollQuery = useGetUserPolls(id);

  const isLoading =
    (!isMe && userQuery.isLoading) || questionQuery.isLoading || pollQuery.isLoading;
  const error = userQuery.error ?? questionQuery.error ?? pollQuery.error;

  const user = isMe ? me : userQuery.data;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !user) {
    // console.error('Failed to load user:', error);
    return <Alert severity="error">加载用户信息失败</Alert>;
  }

  const accuracy =
    user.total_answers > 0 ? ((user.correct_answers / user.total_answers) * 100).toFixed(1) : '-';
  const createdQuestions = questionQuery.data?.questions ?? [];
  const createdVotes = pollQuery.data?.polls ?? [];

  return (
    <PageContainer>
      {/* 用户资料卡 */}
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar src={user.avatar_url} sx={{ width: 72, height: 72, fontSize: 28 }}>
              {user.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Stack direction="column" spacing={1}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {user.nickname}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {user.bio || '这个人很懒，什么都没有留下'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>{'注册于'}</Typography>
                <Typography sx={{ px: 0.5, bgcolor: 'action.hover' }}>
                  {DateTime.fromJSDate(user.registered_at).toFormat('yyyy-MM-dd HH:mm')}
                </Typography>
                {isMe && me && (
                  <>
                    <Typography sx={{ color: 'text.secondary' }}>IP</Typography>
                    <Typography sx={{ px: 0.5, bgcolor: 'action.hover' }}>
                      {me.registered_ip}
                    </Typography>
                  </>
                )}
              </Stack>
              {isMe && me && (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>{'上次登录'}</Typography>
                  <Typography sx={{ px: 0.5, bgcolor: 'action.hover' }}>
                    {me.last_login_at
                      ? DateTime.fromJSDate(me.last_login_at).toFormat('yyyy-MM-dd HH:mm')
                      : '未知'}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>IP</Typography>
                  <Typography sx={{ px: 0.5, bgcolor: 'action.hover' }}>
                    {me.last_login_ip}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
          {isMe && me && (
            <>
              <Divider />
              <EditProfileForm user={me} initialNickname={me.nickname} mutate={userQuery.mutate} />
              <Divider />
              <ChangePasswordForm />
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 用户答题页面 */}
          <Stack
            sx={{ width: '100%', flexWrap: 'wrap' }}
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <StatItem label="正确率" value={accuracy === '-' ? '-' : `${accuracy}%`} />
            <StatItem label="答题次数" value={formatNumberShort(user.total_answers)} />
            <StatItem label="创建题目" value={formatNumberShort(user.questions_created)} />
            <StatItem label="创建投票" value={formatNumberShort(user.polls_created)} />
            <StatItem label="获赞数" value={formatNumberShort(user.likes_received)} />
          </Stack>
        </CardContent>
      </Card>
      {/* 创建的投票 */}
      <ContentCardGridSection
        icon={<PollIcon color="secondary" />}
        title={isMe ? '我创建的投票' : '创建的投票'}
        items={createdVotes}
        emptyText="还没有创建过投票"
        getKey={(poll) => poll.id}
        gridSize={{ xs: 12, md: 6 }}
        spacing={2}
        renderCard={(poll) => <VotePreviewCard poll={poll} />}
      />
      {/* 创建的题目 */}
      <ContentCardGridSection
        icon={<QuizIcon color="primary" />}
        title={isMe ? '我创建的题目' : '创建的题目'}
        items={createdQuestions}
        emptyText="还没有创建过题目"
        getKey={(question) => question.id}
        gridSize={{ xs: 12, md: 6 }}
        spacing={2}
        renderCard={(question) => <QuestionPreviewCard question={question} />}
      />
    </PageContainer>
  );
}
