import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { getMoeLinkAccountUrl } from '@/util/moelink';

export default function MoeLinkAccountCard() {
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        账号资料由 MoeLink 统一管理。昵称、头像、简介、密码以及 Google / GitHub
        等第三方账号绑定，请前往 MoeLink 修改，修改后这里会同步更新。
      </Alert>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button
          variant="contained"
          endIcon={<OpenInNewIcon />}
          href={getMoeLinkAccountUrl()}
          target="_blank"
          rel="noopener"
        >
          前往 MoeLink 管理账号
        </Button>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          将在新标签页打开，并自动保持登录
        </Typography>
      </Stack>
    </Stack>
  );
}
