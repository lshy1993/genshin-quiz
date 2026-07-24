import { Alert, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { User } from '@/api/dto';
import { updateUser } from '@/api/genshinQuizAPI';
import CountrySelect from '../Select/CountrySelect';

interface Props {
  user: User;
  initialNickname: string;
  mutate: () => void;
}

type UserSexuality = User['sexuality'];

export default function EditProfileForm({ user, initialNickname, mutate }: Props) {
  const [nickname, setNickname] = useState<string>(initialNickname ?? '');
  const [bio, setBio] = useState<string>(user.bio ?? '');
  const [sexuality, setSexuality] = useState<UserSexuality>(user.sexuality ?? 'other');
  const [country, setCountry] = useState<string>(user.country ?? '');
  const [emailPublicity, setEmailPublicity] = useState<boolean>(user.email_public ?? false);
  const [saving, setSaving] = useState<boolean>(false);

  const sexualityOptions: UserSexuality[] = ['male', 'female', 'other'];
  const emailPublicityOptions: string[] = ['true', 'false'];

  const handleSave = () => {
    setSaving(true);
    updateUser(user.uuid, {
      ...user,
      nickname,
      bio,
      sexuality,
      country,
      email_public: emailPublicity,
    })
      .then(() => {
        mutate();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid size={2}>
        <Typography>uuid</Typography>
      </Grid>
      <Grid size={10}>
        <Typography>{user.uuid}</Typography>
      </Grid>
      <Grid size={2}>
        <Typography>头像</Typography>
      </Grid>
      <Grid size={10}>
        <Typography>{user.avatar_url}</Typography>
      </Grid>
      <Grid size={2}>
        <Typography>性别</Typography>
      </Grid>
      <Grid size={10}>
        <TextField
          select
          size="small"
          value={sexuality}
          onChange={(e) => setSexuality(e.target.value as UserSexuality)}
        >
          {sexualityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={2}>
        <Typography>地区</Typography>
      </Grid>
      <Grid size={10}>
        <CountrySelect code={country} setCode={setCountry} />
      </Grid>
      <Grid size={2}>
        <Typography>昵称</Typography>
      </Grid>
      <Grid size={10}>
        <TextField
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid size={2}>
        <Typography>个人说明</Typography>
      </Grid>
      <Grid size={10}>
        <TextField value={bio} onChange={(e) => setBio(e.target.value)} size="small" fullWidth />
      </Grid>
      <Grid size={2}>
        <Typography>电子邮箱</Typography>
      </Grid>
      <Grid size={10}>
        <Typography>{user.email}</Typography>
        {user.email_verified ? (
          <Alert severity="success">已验证</Alert>
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Alert severity="warning">邮箱未验证绑定</Alert>
            <Button variant="contained" size="small" onClick={() => {}}>
              验证邮箱
            </Button>
          </Stack>
        )}
      </Grid>
      <Grid size={2}>
        <Typography>是否开放</Typography>
      </Grid>
      <Grid size={10}>
        <TextField
          select
          size="small"
          value={emailPublicity}
          onChange={(e) => setEmailPublicity(e.target.value === 'true')}
        >
          {emailPublicityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'true' ? '是' : '否'}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Button onClick={handleSave} disabled={saving} variant="contained">
        更新
      </Button>
    </Grid>
  );
}
