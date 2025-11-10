import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Vote } from '@/api/dto';

interface VoteTableProps {
  votes: Vote[];
}

export default function VoteTable({ votes }: VoteTableProps) {
  const navigate = useNavigate();

  if (votes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          暂无正在进行中的投票
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container direction="column" spacing={2}>
      {votes.map((vote) => (
        <Card key={vote.id}>
          <CardActionArea onClick={() => navigate(`/votes/${vote.id}`)}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {vote.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  时间：{vote.created_at?.toDateString()} ~ {vote.expire_at?.toDateString()}
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
    </Grid>
  );
}
