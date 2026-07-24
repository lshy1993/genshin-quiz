import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { postChangePassword } from '@/api/genshinQuizAPI';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    setLoading(true);
    postChangePassword({
      old_password: oldPassword,
      new_password: newPassword,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error('Error changing password:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid size={2}>
        <Typography>当前密码</Typography>
      </Grid>
      <Grid size={10}>
        <TextField
          type={showOldPassword ? 'text' : 'password'}
          size="small"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={2}>
        <Typography>新密码</Typography>{' '}
      </Grid>
      <Grid size={10}>
        <TextField
          type={showNewPassword ? 'text' : 'password'}
          size="small"
          // fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Button disabled={loading} variant="contained" onClick={handleChange}>
        修改
      </Button>
    </Grid>
  );
}
