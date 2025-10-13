import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserInfoBox } from './UserInfoBox';

export default function TopBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { labelKey: 'home', path: '/home' },
    { labelKey: 'votes', path: '/votes' },
    { labelKey: 'questions', path: '/questions' },
    { labelKey: 'exams', path: '/exams' },
    { labelKey: 'rank', path: '/rank' },
    { labelKey: 'about', path: '/about' },
  ];
  const currentTab = navItems.findIndex((item) => location.pathname.startsWith(item.path));
  const tabValue = currentTab === -1 ? 0 : currentTab;

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
            onClick={() => navigate('/')}
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
        <UserInfoBox />
      </Toolbar>
    </AppBar>
  );
}
