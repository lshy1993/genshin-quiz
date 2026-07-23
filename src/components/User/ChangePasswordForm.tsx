import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { Fetcher } from '@/api/fetcher/fetcher';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setLoading(true);
    try {
      await Fetcher({
        url: '/auth/change-password',
        method: 'POST',
        data: { old_password: oldPassword, new_password: newPassword },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
      <TextField
        label="当前密码"
        type="password"
        size="small"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextField
        label="新密码"
        type="password"
        size="small"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button disabled={loading} variant="contained" onClick={handleChange}>
        修改
      </Button>
    </Box>
  );
}
