import { generatePath } from 'react-router-dom';

export const PATHS = {
  ROOT: '/',
  HOME: '/home',

  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  QUESTIONS: '/questions',
  QUESTION_CREATE: '/questions/create',
  QUESTION_DETAIL: '/questions/:id',

  POLLS: '/polls',
  POLL_CREATE: '/polls/create',
  POLL_DETAIL: '/polls/:id',

  EXAMS: '/exams',
  EXAM_CREATE: '/exams/create',
  EXAM_DETAIL: '/exams/:id',
  EXAM_PLAY: '/exams/:id/play',

  USERS: '/users/:id',

  RANK: '/rank',
  ABOUT: '/about',

  ADMIN: '/admin',

  NOT_FOUND: '*',
} as const;

export const routes = {
  home: () => PATHS.HOME,

  login: () => PATHS.LOGIN,

  questions: () => PATHS.QUESTIONS,
  createQuestion: () => PATHS.QUESTION_CREATE,
  question: (id: string) => generatePath(PATHS.QUESTION_DETAIL, { id }),

  polls: () => PATHS.POLLS,
  createPoll: () => PATHS.POLL_CREATE,
  poll: (id: string) => generatePath(PATHS.POLL_DETAIL, { id }),

  exams: () => PATHS.EXAMS,
  creatExam: () => PATHS.EXAM_CREATE,
  exam: (id: string) => generatePath(PATHS.EXAM_DETAIL, { id }),
  startExam: (id: string) => generatePath(PATHS.EXAM_PLAY, { id }),

  user: (id: string) => generatePath(PATHS.USERS, { id }),

  rank: () => PATHS.RANK,

  about: () => PATHS.ABOUT,

  forgotPassword: () => PATHS.FORGOT_PASSWORD,
  resetPassword: () => PATHS.RESET_PASSWORD,
  verifyEmail: () => PATHS.VERIFY_EMAIL,
} as const;
