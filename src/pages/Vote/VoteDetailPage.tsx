import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Vote, VoteVotedOptions } from '@/api/dto';
import PageContainer from '@/components/PageContainer';
import VoteChoices from '@/components/Vote/VoteChoices';
import VoteMetaFooter from '@/components/Vote/VoteMetaFooter';
import VoteMetaHeader from '@/components/Vote/VoteMetaHeader';
import { mockVotes } from '@/util/mock';

export default function VoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [voteInfo, setVoteInfo] = useState<Vote | null>(mockVotes.find((v) => v.id === id) || null);

  if (!voteInfo) {
    return <Alert severity="error">投票信息不存在</Alert>;
  }

  // 这里应调用接口提交投票结果
  const handleSubmit = (_selected: VoteVotedOptions) => {
    // mock 提交成功，更新本地状态
    setVoteInfo((prev) =>
      prev
        ? {
            ...prev,
            voted_options: _selected,
          }
        : null,
    );
  };

  return (
    <PageContainer>
      <Box>
        <Button size="small" component={Link} to="/votes">
          ← 返回投票列表
        </Button>
        <Tooltip title="随机一题">
          <IconButton>
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Card>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="投票" />
          <Tab label="统计结果" />
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
                        {option.text}：{option.votes} 票
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
