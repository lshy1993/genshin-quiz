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
import { useParams } from 'react-router-dom';
import { useGetQuestions, useGetUser, useGetVotes } from '@/api/genshinQuizAPI';
import ContentCardGridSection from '@/components/ContentCardGridSection';
import PageContainer from '@/components/PageContainer';
import QuestionPreviewCard from '@/components/Question/QuestionPreviewCard';
import ChangePasswordForm from '@/components/User/ChangePasswordForm';
import EditProfileForm from '@/components/User/EditProfileForm';
import VotePreviewCard from '@/components/Vote/VotePreviewCard';
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

  const isMe = me?.uuid === id;
  // fetch target user info
  const { data: user, isLoading: isUserLoading, error: userError } = useGetUser(id ?? '');
  const { data: questionRes } = useGetQuestions({
    created_by: id,
    limit: LIST_LIMIT,
    language: [currentLanguage],
    sortBy: 'created_at',
    sortDesc: true,
  });
  const { data: voteRes } = useGetVotes({
    created_by: id,
    limit: LIST_LIMIT,
    language: [currentLanguage],
    sortBy: 'created_at',
    sortDesc: true,
  });

  if (isUserLoading) {
    return <CircularProgress />;
  }

  if (userError || !user) {
    console.error('Failed to load user:', userError);
    return <Alert severity="error">加载用户信息失败</Alert>;
  }

  const accuracy =
    user.total_answers > 0 ? ((user.correct_answers / user.total_answers) * 100).toFixed(1) : '-';
  const createdQuestions = questionRes?.questions ?? [];
  const createdVotes = voteRes?.votes ?? [];

  return (
    <PageContainer>
      {/* 用户资料卡 */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar src={user.avatar_url} sx={{ width: 72, height: 72, fontSize: 28 }}>
              {user.nickname.charAt(0).toUpperCase()}
            </Avatar>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {user.nickname}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.country || '未知地区'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {'注册于'}
                {user.registered_at.toLocaleDateString()}
                {user.registered_ip && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    IP: {user.registered_ip}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {'上次登录'}
                {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : '未知'}
                {user.last_login_ip && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    IP: {user.last_login_ip}
                  </Typography>
                )}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ flexWrap: 'wrap' }}
            >
              <StatItem label="正确率" value={accuracy === '-' ? '-' : `${accuracy}%`} />
              <StatItem label="答题次数" value={formatNumberShort(user.total_answers)} />
              <StatItem label="创建题目" value={formatNumberShort(user.questions_created)} />
              <StatItem label="参与投票" value={formatNumberShort(user.votes)} />
              {typeof user.likes_received === 'number' && (
                <StatItem label="获赞数" value={formatNumberShort(user.likes_received)} />
              )}
            </Stack>
            {isMe && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <EditProfileForm userId={user.uuid} initialNickname={user.nickname} />
                <Box sx={{ height: 8 }} />
                <ChangePasswordForm />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* 创建的投票 */}
      <ContentCardGridSection
        icon={<PollIcon color="secondary" />}
        title={isMe ? '我创建的投票' : '创建的投票'}
        items={createdVotes}
        emptyText="还没有创建过投票"
        getKey={(vote) => vote.id}
        gridSize={{ xs: 12, md: 6 }}
        spacing={2}
        renderCard={(vote) => <VotePreviewCard vote={vote} language={currentLanguage} />}
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
