import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import VoteFilter from '@/components/Vote/VoteFilter';
import { VoteType } from '@/util/enum';
import { mockVotes } from '@/util/mock';

// import { useGetVotes } from '@/api/vote';

export default function VoteListPage() {
  const navigate = useNavigate();
  // const { data: votes = [] } = useGetVotes({ status: 'ongoing' });
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<VoteType>(VoteType.ONGOING);

  // 过滤和搜索
  const filteredVotes = mockVotes.filter(
    (vote) => vote.expired === false && vote.title.includes(search),
  );

  return (
    <PageContainer>
      <BannerBox title={'投票列表'} subtitle={'参与投票吧！谁是真正的人气王！'} />
      <VoteFilter
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      <Grid container direction="column" spacing={2}>
        {filteredVotes.map((vote) => (
          <Card key={vote.id}>
            <CardActionArea onClick={() => navigate(`/votes/${vote.id}`)}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {vote.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    时间：{vote.created_at?.toDateString()} ~ {vote.expires_at?.toDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    参与人数：{vote.participants ?? '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总票数：{vote.total_votes ?? '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    作者：{vote.created_by}
                  </Typography>
                </Box>
                {/* <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {vote.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box> */}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
        {filteredVotes.length === 0 && (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            暂无正在进行中的投票
          </Box>
        )}
      </Grid>
    </PageContainer>
  );
}
