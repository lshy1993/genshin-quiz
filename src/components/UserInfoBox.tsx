import { Avatar, Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/context/UserContext';

export const UserInfoBox = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
      {user ? (
        <>
          <Avatar src={user.avatar_url} alt={user.username} sx={{ width: 32, height: 32 }} />
          <Typography>{user.username}</Typography>
          <Button onClick={() => alert('logout')}>退出</Button>
        </>
      ) : (
        <Button
          color="inherit"
          onClick={() => {
            navigate('/login');
          }}
        >
          {t('topbar.btn_label.login_signup')}
        </Button>
      )}
    </Box>
  );
};
