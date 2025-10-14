import {
  Box,
  Card,
  CardActionArea,
  CardContent,
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
import { mockVotes } from '@/util/mock';

// import { useGetVotes } from '@/api/vote';

export default function VoteListPage() {
  // const { data: votes = [] } = useGetVotes({ status: 'ongoing' });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  // 过滤和搜索
  const filteredVotes = mockVotes.filter(
    (vote) => vote.expired === false && vote.title.includes(search),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 900,
        minWidth: 480,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          p: 1,
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
          <Card key={vote.id}>
            <CardActionArea onClick={() => navigate(`/vote/${vote.id}`)}>
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
    </Box>
  );
}
