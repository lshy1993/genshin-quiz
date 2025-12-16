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
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Vote, VoteVotedOptions } from '@/api/dto';
import { useGetVote } from '@/api/genshinQuizAPI';
import RandomButton from '@/components/Button/RandomButton';
import PageContainer from '@/components/PageContainer';
import VoteChoices from '@/components/Vote/VoteChoices';
import VoteMetaFooter from '@/components/Vote/VoteMetaFooter';
import VoteMetaHeader from '@/components/Vote/VoteMetaHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function VoteDetailPage() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useUser();
  const { id } = useParams<{ id: string }>();
  const { data: voteInfo, isLoading, error } = useGetVote(id ?? '');

  const [currentTab, setCurrentTab] = useState<number>(0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !voteInfo) {
    console.error('Failed to load vote:', error);
    return <Alert severity="error">加载题目失败</Alert>;
  }

  // 这里应调用接口提交投票结果
  const handleSubmit = (_selected: VoteVotedOptions) => {
    // mock 提交成功，更新本地状态
  };

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/votes">
          ← 返回投票列表
        </Button>
        <RandomButton tooltip="随机查看投票" onClick={() => {}} />
      </Box>
      <Card>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="投票" />
          <Tab label="统计结果" disabled={!isAuthenticated} />
        </Tabs>
        <CardContent>
          <Stack spacing={1} divider={<Divider flexItem />}>
            <VoteMetaHeader voteInfo={voteInfo} />
            {currentTab === 0 && (
              <VoteChoices
                options={voteInfo.options}
                voted={voteInfo.voted_options}
                maxVotes={voteInfo.votes_per_user}
                votesPerOption={voteInfo.votes_per_option ?? 1}
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
                        {option.text?.[currentLanguage]}:{option.votes} 票
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            ml: 1,
                            width: `${((option.votes ?? 0) / (voteInfo.total_votes ?? 1)) * 100}%`,
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
            <VoteMetaFooter voteInfo={voteInfo} />
          </Stack>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
