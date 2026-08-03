import { Alert, Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import type { Gender, UserPrivate, Visibility } from '@/api/dto';
import { postSendVerificationEmail, updateUser } from '@/api/genshinQuizAPI';
import CountrySelect from '../Select/CountrySelect';

interface Props {
  user: UserPrivate;
  initialNickname: string;
  mutate: () => void;
}

export default function EditProfileForm({ user, initialNickname }: Props) {
  const [nickname, setNickname] = useState<string>(initialNickname ?? '');
  const [bio, setBio] = useState<string>(user.bio ?? '');
  const [gender, setGender] = useState<Gender>(user.gender ?? 'other');
  const [country, setCountry] = useState<string>(user.country ?? '');
  const [emailPublicity, setEmailPublicity] = useState<Visibility>(user.email_visibility);
  const [saving, setSaving] = useState<boolean>(false);

  const genderOptions: Gender[] = ['unknown', 'male', 'female', 'other'];
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
        enqueueSnackbar('已更新', {
          variant: 'success',
        });
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        enqueueSnackbar('更新失败', {
          variant: 'error',
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleSendVerifyEmail = () => {
    if (user.email) {
      postSendVerificationEmail({ email: user.email })
        .then(() => {
          enqueueSnackbar('已发送至邮箱', {
            variant: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('发送失败', {
            variant: 'error',
          });
        });
    }
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
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography>{user.email}</Typography>
          {user.email_verified ? (
            <Alert severity="success">已验证</Alert>
          ) : (
            <>
              <Alert severity="warning">邮箱未验证绑定</Alert>
              <Button variant="contained" size="small" onClick={handleSendVerifyEmail}>
                验证邮箱
              </Button>
            </>
          )}
        </Stack>
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
