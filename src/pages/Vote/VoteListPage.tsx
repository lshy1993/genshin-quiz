import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { useGetVotes } from '@/api/vote';

const mockVotes = [
  {
    id: 1,
    title: '最喜欢的角色投票',
    startTime: '2025-10-01',
    endTime: '2025-10-20',
    participants: 120,
    votes: 300,
    type: '单选',
    tags: ['角色', '人气'],
    author: '管理员A',
    status: '进行中',
  },
  {
    id: 2,
    title: '最强武器评选',
    startTime: '2025-10-05',
    endTime: '2025-10-25',
    participants: 80,
    votes: 200,
    type: '多选',
    tags: ['武器'],
    author: '管理员B',
    status: '进行中',
  },
];

export default function VoteListPage() {
  // const { data: votes = [] } = useGetVotes({ status: 'ongoing' });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  // 过滤和搜索
  const filteredVotes = mockVotes.filter(
    (vote) =>
      vote.status === '进行中' &&
      vote.title.includes(search) &&
      (typeFilter ? vote.type === typeFilter : true),
  );

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      {/* Banner */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          正在进行中的投票
        </Typography>
        <Typography variant="subtitle1">参与喜欢的话题，为你支持的选项投票吧！</Typography>
      </Box>

      {/* 搜索和过滤器 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="搜索投票"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 2 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>类型</InputLabel>
          <Select label="类型" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">全部</MenuItem>
            <MenuItem value="单选">单选</MenuItem>
            <MenuItem value="多选">多选</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Vote 列表 */}
      <Grid container direction="column" spacing={2}>
        {filteredVotes.map((vote) => (
          <Grid item key={vote.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/vote/${vote.id}`)}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {vote.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      时间：{vote.startTime} ~ {vote.endTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      参与人数：{vote.participants}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      总票数：{vote.votes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      类型：{vote.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      作者：{vote.author}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {vote.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {filteredVotes.length === 0 && (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            暂无正在进行中的投票
          </Box>
        )}
      </Grid>
    </Box>
  );
}
