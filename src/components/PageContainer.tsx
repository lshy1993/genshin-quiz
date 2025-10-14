import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 900,
  minWidth: 480,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

export default PageContainer;
