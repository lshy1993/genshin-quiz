import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Popper, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/context/UserContext';
import UserInfoPanel from './UserInfoPanel';

export const UserInfoBox = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // 检查文字是否溢出
  useEffect(() => {
    if (textRef.current && user?.nickname) {
      const element = textRef.current;
      const isOverflowing = element.scrollWidth > element.clientWidth;
      setShowTooltip(isOverflowing);
    }
  }, [user?.nickname]);

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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
            <Tooltip title={showTooltip ? user.nickname : ''} arrow>
              <Typography
                ref={textRef}
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {user.nickname}
              </Typography>
            </Tooltip>
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
