import { QuestionCategory, QuestionDifficulty, QuestionType } from '@/api/dto';

export const allCategories = Object.values(QuestionCategory);
export const allDifficulties = Object.values(QuestionDifficulty);
export const allQuestionTypes = Object.values(QuestionType);
export const allLanguages = ['zh', 'ja', 'en'];
