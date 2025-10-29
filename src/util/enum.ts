import { QuestionCategory, QuestionDifficulty, QuestionType } from '@/api/dto';

export const allCategories = Object.values(QuestionCategory);
export const allDifficulties = Object.values(QuestionDifficulty);
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
