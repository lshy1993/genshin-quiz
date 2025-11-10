import { createTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DevHelperWrapper from './components/DevHelperWrapper.tsx';
import { UserProvider } from './context/UserContext.tsx';

const theme = createTheme({
  palette: {
    mode: 'light', // 或 'dark'
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

const isDev = import.meta.env.MODE === 'development';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <UserProvider>
            {isDev ? (
              <DevHelperWrapper>
                <App />
              </DevHelperWrapper>
            ) : (
              <App />
            )}
          </UserProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
