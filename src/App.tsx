import { Box } from '@mui/material';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminRouteComponent from './admin/AdminRouteComponent';
import TopBarComponent from './components/TopBarComponent';

import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import QuizDetailPage from './pages/Quiz/QuizDetailPage';
import QuizListPage from './pages/Quiz/QuizListPage';
import VoteDetailPage from './pages/Vote/VoteDetailPage';
import VoteListPage from './pages/Vote/VoteListPage';

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <TopBarComponent />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <Routes>
            <Route path="/admin" element={<AdminRouteComponent />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/quiz" element={<QuizListPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} />
            <Route path="/vote" element={<VoteListPage />} />
            <Route path="/vote/:id" element={<VoteDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
