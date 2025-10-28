import { t } from 'i18next';
import z from 'zod';
import {
  type Question,
  QuestionCategory,
  QuestionDifficulty,
  QuestionType,
  type QuestionWithAnswer,
} from '@/api/dto';

export function formatNumberShort(count: number): string {
  if (count >= 1_000_000_000_000)
    return `${(count / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}t`;
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return count.toString();
}

export function getCorrectRate(q: Question, fixed: number = 1): number {
  if (!q.answer_count || !q.correct_count) return 0;
  if (q.answer_count === 0) return 0;
  const rate = q.correct_count / q.answer_count;
  return parseFloat((rate * 100).toFixed(fixed));
}

export function getQuestionTypeLabel(type: string): string {
  return t(`question.type.${type}`);
}

export function getDifficultyLabel(diff: string): string {
  return t(`question.difficulty.${diff}`);
}

export function getCategoryLabel(category: string): string {
  return t(`question.category.${category}`);
}

export function getLanguageLabel(lang: string): string {
  switch (lang) {
    case 'zh':
      return '中文';
    case 'en':
      return 'English';
    case 'ja':
      return '日本語';
    case 'ko':
      return '한국어';
    default:
      return lang;
  }
}

export function getDifficultyColor(diff: string): 'success' | 'warning' | 'error' | 'default' {
  switch (diff) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'error';
    default:
      return 'default';
  }
}

export function areAnswersEqual(answer: string[], selected: string[]): boolean {
  const answerSet = new Set(answer);
  const selectedSet = new Set(selected);

  if (answerSet.size !== selectedSet.size) return false;

  for (const uuid of answerSet) {
    if (!selectedSet.has(uuid)) return false;
  }

  return true;
}

export const createQuestionOptionSchema = z.object({
  type: z.enum(['text', 'image'], { message: '请选择选项类型' }),
  text: z
    .record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '选项内容不能为空'))
    .refine((val) => Object.keys(val).length > 0, { message: '至少需要一个语言选项' }),
  is_answer: z.boolean(),
});

// Zod 验证 schema
export const createQuestionSchema = z.object({
  public: z.boolean(),
  question_type: z.enum(QuestionType, { message: '请选择题目类型' }),
  category: z.enum(QuestionCategory, { message: '请选择题目分类' }),
  difficulty: z.enum(QuestionDifficulty, { message: '请选择题目难度' }),
  options: z
    .array(createQuestionOptionSchema)
    .min(2, '至少需要两个选项')
    .refine((opts) => opts.some((opt) => opt.is_answer), {
      message: '必须至少有一个正确答案',
      path: ['options'],
    }),
  /** 多语言题干 */
  question_text: z
    .record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '题干内容不能为空'))
    .refine((val) => Object.keys(val).length > 0, { message: '至少需要一个语言选项' }),
  /** 多语言解释 */
  explanation: z.record(z.string().min(1, '语言代码不能为空'), z.string()).optional(),
});

export function createEmptyQuestionForm(languageCode: string): QuestionWithAnswer {
  return {
    public: true,
    category: QuestionCategory.character,
    difficulty: QuestionDifficulty.easy,
    question_type: QuestionType.single_choice,
    question_text: { [languageCode]: '' },
    explanation: { [languageCode]: '' },
    options: [
      { id: '', type: 'text', text: { [languageCode]: '' }, is_answer: true },
      { id: '', type: 'text', text: { [languageCode]: '' }, is_answer: false },
    ],
  };
}
