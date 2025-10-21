import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Popper, Typography } from '@mui/material';
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

  return (
    <Box sx={{ width: '200px', display: 'flex', alignItems: 'center', gap: 1 }}>
      {user ? (
        <>
          <Box
            ref={anchorRef}
            onClick={handleToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 1,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              width: '100%',
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
            <ExpandMoreIcon
              sx={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
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
