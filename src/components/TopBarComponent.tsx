import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserInfoBox } from './UserInfoBox';

export default function TopBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NaviButton = ({ path }: { path: string }) => {
    return (
      <Button
        color="inherit"
        variant={isActive(`/${path}`) ? 'outlined' : 'text'}
        onClick={() => navigate(`/${path}`)}
      >
        {t(`topbar.btn_label.${path}`)}
      </Button>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
            onClick={() => navigate('/')}
          >
            {t('topbar.title')}
          </Button>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <NaviButton path="home" />
          <NaviButton path="quiz" />
          <NaviButton path="vote" />
          <NaviButton path="rank" />
          <NaviButton path="about" />
        </Box>
        <UserInfoBox />
      </Toolbar>
    </AppBar>
  );
}
