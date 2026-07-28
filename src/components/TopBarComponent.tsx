import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS, routes } from '@/route/route';
import { LoginUserMenu } from './LoginUserMenu';

export default function TopBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { labelKey: 'home', path: PATHS.HOME },
    { labelKey: 'polls', path: PATHS.POLLS },
    { labelKey: 'questions', path: PATHS.QUESTIONS },
    { labelKey: 'exams', path: PATHS.EXAMS },
    { labelKey: 'rank', path: PATHS.RANK },
    { labelKey: 'about', path: PATHS.ABOUT },
  ];
  const currentTab = navItems.findIndex((item) => {
    if (item.path === PATHS.RANK && location.pathname.startsWith('/user')) {
      return true;
    }

    return location.pathname.startsWith(item.path);
  });
  const tabValue = currentTab === -1 ? 0 : currentTab;

  const handleClickHome = () => {
    navigate(routes.home());
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
            onClick={handleClickHome}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('topbar.title')}
            </Typography>
          </Button>
          <Tabs
            sx={{ minHeight: 50, display: 'flex', alignItems: 'center', gap: 2 }}
            value={tabValue}
            onChange={(_, idx) => navigate(navItems[idx].path)}
            textColor="inherit"
            indicatorColor="secondary"
            centered
          >
            {navItems.map((item) => (
              <Tab
                key={item.path}
                label={t(`topbar.btn_label.${item.labelKey}`)}
                sx={{ minWidth: 80 }}
              />
            ))}
          </Tabs>
        </Box>
        <LoginUserMenu />
      </Toolbar>
    </AppBar>
  );
}
