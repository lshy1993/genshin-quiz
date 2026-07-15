import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, Popper, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/context/UserContext';
import UserInfoPanel from './UserInfoPanel';

export const UserInfoBox = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleGoToProfile = () => {
    if (!user?.uuid) return;
    navigate(`/users/${user.uuid}`);
  };

  return (
    <Box sx={{ width: '200px', display: 'flex', alignItems: 'center', gap: 1 }}>
      {user ? (
        <>
          <Box
            ref={anchorRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '4px 8px',
              borderRadius: 1,
              width: '100%',
            }}
          >
            <Box
              onClick={handleGoToProfile}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                flex: 1,
                minWidth: 0,
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Avatar src={user.avatar_url} alt={user.nickname} sx={{ width: 32, height: 32 }} />
              <Typography
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {user.nickname}
              </Typography>
            </Box>
            <IconButton color="inherit" size="small" onClick={handleToggle}>
              <ExpandMoreIcon
                sx={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </IconButton>
          </Box>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-end"
            sx={{ zIndex: 1200 }}
          >
            <UserInfoPanel setOpen={setOpen} />
          </Popper>
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
