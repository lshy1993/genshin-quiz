import PersonIcon from '@mui/icons-material/Person';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGetUser } from '@/api/genshinQuizAPI';

interface Props {
  userId: string;
  showAvatar?: boolean;
}

export default function AuthorLink({ userId, showAvatar = false }: Props) {
  const { data: author, isLoading, error } = useGetUser(userId);

  if (isLoading) {
    return <Skeleton />;
  }

  if (error || !author) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        作者：
      </Typography>
      <Link
        component={RouterLink}
        to={`/users/${author.uuid}`}
        underline="hover"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <Typography color="inherit">{author.nickname}</Typography>
      </Link>
      {showAvatar && (
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
          }}
        >
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.nickname}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PersonIcon fontSize="small" />
          )}
        </Box>
      )}
    </Box>
  );
}
