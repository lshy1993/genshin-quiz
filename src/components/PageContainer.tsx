import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

type PageContainerProps = {
  maxWidth?: number | string;
};

const PageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<PageContainerProps>(({ theme, maxWidth = 900 }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth,
  minWidth: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

export default PageContainer;
