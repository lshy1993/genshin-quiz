import { Category, Difficulty, QuestionType } from '@/api/dto';

export const allCategories = Object.values(Category);
export const allDifficulties = Object.values(Difficulty);
export const allQuestionTypes = Object.values(QuestionType);
export const allLanguages = ['zh', 'ja', 'en', 'ko'];

export enum VoteType {
  ALL = 'all',
  EXPIRED = 'expired',
  ONGOING = 'ongoing',
}

export enum QuestionSortType {
  DEFAULT = 'default',
  DIFFICULTY = 'difficulty',
  CATEGORY = 'category',
  ANSWER_COUNT = 'answerCount',
  CORRECT_RATE = 'correctRate',
}

export enum ExamSortType {
  DEFAULT = 'default',
  TITLE = 'title',
  DIFFICULTY = 'difficulty',
}
