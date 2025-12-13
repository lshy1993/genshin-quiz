import { t } from 'i18next';
import z from 'zod';
import {
  type Question,
  QuestionCategory,
  QuestionDifficulty,
  QuestionType,
  type QuestionWithAnswer,
  type VoteWithOption,
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
      { type: 'text', text: { [languageCode]: '' }, is_answer: true },
      { type: 'text', text: { [languageCode]: '' }, is_answer: false },
    ],
  };
}

export const createVoteOptionSchema = z.object({
  type: z.enum(['text', 'image', 'url'], { message: '请选择选项类型' }),
  text: z
    .record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '选项内容不能为空'))
    .refine((val) => Object.keys(val).length > 0, { message: '至少需要一个语言选项' }),
});

// Zod 验证 schema
export const createVoteSchema = z.object({
  public: z.boolean(),
  password: z.string().optional(),
  title: z.record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '投票标题不能为空')),
  description: z.record(z.string().min(1, '语言代码不能为空'), z.string().optional()),
  options: z.array(createVoteOptionSchema).min(1, '至少需要1个投票项'),
  tags: z.array(z.string().min(1, '标签不能为空')).optional(),
  start_at: z.date().optional(),
  expire_at: z.date().min(new Date(), '截止时间必须在当前时间之后').optional(),
  /** 每个用户最多可投票数 */
  votes_per_user: z.number().int().min(1, '每个用户最多可投票数必须至少为1'),
  votes_per_option: z.number().int().min(0, '每个选项的最大可投票数不能为负数'),
});

export function createEmptyVoteForm(): VoteWithOption {
  return {
    public: true,
    title: { zh: '' },
    description: { zh: '' },
    category: QuestionCategory.character,
    tags: [],
    start_at: new Date(),
    /** 每个用户最多可投票数 */
    votes_per_user: 1,
    /** 每个选项的最大可投票数，0表示无限制 */
    votes_per_option: 0,
    options: [],
  };
}
