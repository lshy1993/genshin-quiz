import { Alert, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Gender, UserPrivate, Visibility } from '@/api/dto';
import { updateUser } from '@/api/genshinQuizAPI';
import CountrySelect from '../Select/CountrySelect';

interface Props {
  user: UserPrivate;
  initialNickname: string;
  mutate: () => void;
}

export default function EditProfileForm({ user, initialNickname, mutate }: Props) {
  const [nickname, setNickname] = useState<string>(initialNickname ?? '');
  const [bio, setBio] = useState<string>(user.bio ?? '');
  const [gender, setGender] = useState<Gender>(user.gender ?? 'other');
  const [country, setCountry] = useState<string>(user.country ?? '');
  const [emailPublicity, setEmailPublicity] = useState<Visibility>(user.email_visibility);
  const [saving, setSaving] = useState<boolean>(false);

  const genderOptions: Gender[] = ['male', 'female', 'other'];
  const emailPublicityOptions: Visibility[] = ['public', 'private'];

  const handleSave = () => {
    setSaving(true);
    updateUser({
      ...user,
      nickname,
      bio,
      gender,
      country,
      email_visibility: emailPublicity,
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
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
        >
          {genderOptions.map((option) => (
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
          onChange={(e) => setEmailPublicity(e.target.value as Visibility)}
        >
          {emailPublicityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
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
