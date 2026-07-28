import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import AdminRouteComponent from './admin/AdminRouteComponent';
import { RequireAuth } from './components/RequiredAuth';
import TopBarComponent from './components/TopBarComponent';
import { useAuthManager } from './hooks/useAuthManager';
import AboutPage from './pages/AboutPage';
import ExamDetailPage from './pages/Exam/ExamDetailPage';
import ExamListPage from './pages/Exam/ExamListPage';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateQuestionPage from './pages/Question/CreateQuestionPage';
import QuestionDetailPage from './pages/Question/QuestionDetailPage';
import QuestionListPage from './pages/Question/QuestionListPage';
import RankPage from './pages/Rank/RankPage';
import ResetPassword from './pages/ResetPassword';
import UserProfilePage from './pages/User/UserProfilePage';
import VerifyEmail from './pages/VerifyEmail';
import CreateVotePage from './pages/Vote/CreateVotePage';
import VoteDetailPage from './pages/Vote/VoteDetailPage';
import VoteListPage from './pages/Vote/VoteListPage';
import { PATHS } from './route/route';
import { setGlobalNavigate } from './util/navigation';

// 设置全局导航的组件
function NavigationSetup() {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  return null;
}

function App() {
  function AppContent() {
    // 自动管理 JWT token 和 API 认证头
    useAuthManager();

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <NavigationSetup />
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
            <Route path={PATHS.ROOT} element={<Navigate to="/home" />} />
            <Route path={PATHS.HOME} element={<HomePage />} />
            <Route path={PATHS.LOGIN} element={<LoginPage />} />
            <Route path={PATHS.QUESTIONS} element={<QuestionListPage />} />
            <Route
              path={PATHS.QUESTION_CREATE}
              element={
                <RequireAuth>
                  <CreateQuestionPage />
                </RequireAuth>
              }
            />
            <Route path={PATHS.QUESTION_DETAIL} element={<QuestionDetailPage />} />
            <Route path={PATHS.POLLS} element={<VoteListPage />} />
            <Route
              path={PATHS.POLL_CREATE}
              element={
                <RequireAuth>
                  <CreateVotePage />
                </RequireAuth>
              }
            />
            <Route path={PATHS.POLL_DETAIL} element={<VoteDetailPage />} />
            <Route path={PATHS.EXAMS} element={<ExamListPage />} />
            <Route path={PATHS.EXAM_DETAIL} element={<ExamDetailPage />} />
            <Route path={PATHS.RANK} element={<RankPage />} />
            <Route path={PATHS.USERS} element={<UserProfilePage />} />
            <Route path={PATHS.ABOUT} element={<AboutPage />} />
            <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={PATHS.VERIFY_EMAIL} element={<VerifyEmail />} />
            <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
        </Box>
      </Box>
    );
  }

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Router>
        <AppContent />
      </Router>
    </SnackbarProvider>
  );
}

export default App;
