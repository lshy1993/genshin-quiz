import { Box } from '@mui/material';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminRouteComponent from './admin/AdminRouteComponent';
import TopBarComponent from './components/TopBarComponent';

import AboutPage from './pages/AboutPage';
import ExamDetailPage from './pages/Exam/ExamDetailPage';
import ExamListPage from './pages/Exam/ExamListPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import QuestionDetailPage from './pages/Question/QuestionDetailPage';
import QuestionListPage from './pages/Question/QuestionListPage';
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
            p: 3,
          }}
        >
          <Routes>
            <Route path="/admin" element={<AdminRouteComponent />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/questions" element={<QuestionListPage />} />
            <Route path="/questions/:id" element={<QuestionDetailPage />} />
            <Route path="/votes" element={<VoteListPage />} />
            <Route path="/votes/:id" element={<VoteDetailPage />} />
            <Route path="/exams" element={<ExamListPage />} />
            <Route path="/exams/:id" element={<ExamDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
