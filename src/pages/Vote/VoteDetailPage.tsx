import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { LikeStatus, PollVote } from '@/api/dto';
import { postLikePoll, postVotePoll, useGetPoll } from '@/api/genshinQuizAPI';
import RandomButton from '@/components/Button/RandomButton';
import PageContainer from '@/components/PageContainer';
import VoteChoices from '@/components/Vote/VoteChoices';
import VoteMetaFooter from '@/components/Vote/VoteMetaFooter';
import VoteMetaHeader from '@/components/Vote/VoteMetaHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { getLocalizedText } from '@/util/utils';

export default function VoteDetailPage() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user } = useUser();
  const { id } = useParams<{ id: string }>();
  const { data: voteInfo, isLoading, error, mutate } = useGetPoll(id ?? '');

  const [currentTab, setCurrentTab] = useState<number>(0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !voteInfo) {
    console.error('Failed to load vote:', error);
    return <Alert severity="error">加载题目失败</Alert>;
  }

  // 提交投票结果
  const handleSubmit = (options: PollVote[]) => {
    if (options.length === 0) {
      return;
    }

    postVotePoll(voteInfo.id, { options, anonymous: false })
      .then(() => {
        mutate();
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('投票失败，请稍后重试', {
          variant: 'error',
        });
      });
  };

  // 处理点赞
  const handleLike = (likeStatus: LikeStatus) => {
    postLikePoll(voteInfo.id, { like: likeStatus })
      .then(() => {
        mutate();
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('点赞失败，请稍后重试', {
          variant: 'error',
        });
      });
  };

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/polls">
          ← 返回投票列表
        </Button>
        <RandomButton tooltip="随机查看投票" onClick={() => {}} />
      </Box>
      <Card>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="投票" />
          <Tab label="统计结果" />
        </Tabs>
        <CardContent>
          <Stack spacing={2} divider={<Divider flexItem />}>
            <VoteMetaHeader voteInfo={voteInfo} user={user} />
            {currentTab === 0 && (
              <VoteChoices
                options={voteInfo.options}
                voted={voteInfo.my_votes}
                maxVotes={voteInfo.votes_per_user}
                votesPerOption={voteInfo.votes_per_option ?? 1}
                votesPerUser={voteInfo.votes_per_user}
                handleSubmit={handleSubmit}
              />
            )}
            {currentTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  投票结果分析
                </Typography>
                {/* 这里可以放图表或统计信息 */}
                <Box>
                  {voteInfo.options.map((option) => (
                    <Box key={option.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {getLocalizedText(option.text, currentLanguage)}:{option.votes_count} 票
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            ml: 1,
                            width: `${((option.votes_count ?? 0) / (voteInfo.total_votes_count ?? 1)) * 100}%`,
                            height: 8,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                          }}
                        />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <VoteMetaFooter voteInfo={voteInfo} handleLike={handleLike} />
          </Stack>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
