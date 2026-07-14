import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { User } from '../api/dto';
import { useGetUsers } from '../api/genshinQuizAPI';

export default function UsersListPage() {
  const { data: users, error } = useGetUsers();

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">加载用户数据失败: {error.message}</Typography>
      </Box>
    );
  }

  const userList: User[] = users?.users || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          用户管理
        </Typography>
        <Button component={Link} to="/users/create" variant="contained">
          创建新用户
        </Button>
      </Box>
      <Grid container spacing={3}>
        {userList.map((user) => (
          <Grid key={user.uuid} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {user.nickname}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  {user.country}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`积分: ${user.correct_answers || 0}`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`完成: ${user.total_answers || 0}次`}
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 2,
                  }}
                >
                  注册时间: {user.registered_at.toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/users/${user.uuid}`}
                    variant="contained"
                    size="small"
                  >
                    查看详情
                  </Button>
                  <Button
                    component={Link}
                    to={`/users/${user.uuid}/edit`}
                    variant="outlined"
                    size="small"
                  >
                    编辑
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {userList.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
            }}
          >
            暂无用户数据
          </Typography>
        </Box>
      )}
    </Box>
  );
}
