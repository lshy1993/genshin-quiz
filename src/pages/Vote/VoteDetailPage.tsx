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
import type { Vote } from '@/api/dto';
import PageContainer from '@/components/PageContainer';
import VoteChoices from '@/components/Vote/VoteChoices';
import VoteMetaFooter from '@/components/Vote/VoteMetaFooter';
import VoteMetaHeader from '@/components/Vote/VoteMetaHeader';
import { mockVotes } from '@/util/mock';

export default function VoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');
  const [sortByVotes, setSortByVotes] = useState<boolean>(false);

  const voteInfo: Vote | undefined = mockVotes.find((v) => v.id === id);

  if (!voteInfo) {
    return <Alert severity="error">投票信息不存在</Alert>;
  }

  // 过滤和排序
  let filteredItems = voteInfo.options.filter(
    (option) => option.text?.includes(filter) || option.description?.includes(filter),
  );
  if (sortByVotes) {
    filteredItems = [...filteredItems].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  }

  const handleSubmit = () => {
    // 这里应调用接口提交
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
        {currentTab === 0 && (
          <CardContent>
            <Stack spacing={1} divider={<Divider flexItem />}>
              <VoteMetaHeader voteInfo={voteInfo} />
              <VoteChoices
                options={filteredItems}
                voted={voteInfo.voted_options}
                maxVotes={voteInfo.votes_per_user}
                handleSubmit={handleSubmit}
              />
              <VoteMetaFooter voteInfo={voteInfo} />
            </Stack>
          </CardContent>
        )}
        {currentTab === 1 && (
          <CardContent>
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
          </CardContent>
        )}
      </Card>
    </PageContainer>
  );
}
