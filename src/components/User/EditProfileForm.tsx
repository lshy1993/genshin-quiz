import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useUpdateUser } from '@/api/genshinQuizAPI';

interface Props {
  userId: string;
  initialNickname: string;
}

export default function EditProfileForm({ userId, initialNickname }: Props) {
  const [nickname, setNickname] = useState(initialNickname ?? '');
  const [saving, setSaving] = useState(false);
  const updateUser = useUpdateUser(userId);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser.trigger({ nickname });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
      <TextField
        label="昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        size="small"
        fullWidth
      />
      <Button onClick={handleSave} disabled={saving} variant="contained">
        保存
      </Button>
    </Box>
  );
}
