import { t } from 'i18next';
import { DateTime } from 'luxon';

import {
  Category,
  type CreatePollRequest,
  type CreateQuestionRequest,
  Difficulty,
  type Question,
  QuestionType,
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
  if (!q.answers_count || !q.correct_answers_count) return 0;
  if (q.answers_count === 0) return 0;
  const rate = q.correct_answers_count / q.answers_count;
  return parseFloat((rate * 100).toFixed(fixed));
}

export function getTimeStatusText(start: Date, end?: Date) {
  if (!end) return t('time.unlimited');
  const now = DateTime.now();
  const startDt = DateTime.fromJSDate(start);

  if (now < startDt) return t('time.not_started');
  return getCountdownText(end);
}

export function getCountdownText(expireAt: Date | undefined): string {
  if (!expireAt) {
    return '-';
  }

  const now = Date.now();
  const diffMs = expireAt.getTime() - now;
  if (diffMs <= 0) {
    return t('time.ended');
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return t('time.days_hours', { days, hours });
  }

  if (hours > 0) {
    return t('time.hours_minutes', { hours, minutes });
  }

  if (minutes > 0) {
    return t('time.minutes_seconds', { minutes, seconds });
  }

  return t('time.seconds', { seconds });
}

// 密码强度计算辅助函数
export const getPasswordStrength = (pass: string) => {
  let score = 0;
  if (!pass) return { score: 0, label: '', color: 'error' as const };

  if (pass.length >= 6) score += 25;
  if (pass.length >= 10) score += 25;
  if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score += 25;
  if (/[^a-zA-Z0-9]/.test(pass)) score += 25;

  if (score <= 25) return { score, label: t('password_strength.weak'), color: 'error' as const };
  if (score <= 50) return { score, label: t('password_strength.medium'), color: 'warning' as const };
  if (score <= 75) return { score, label: t('password_strength.good'), color: 'info' as const };
  return { score, label: t('password_strength.strong'), color: 'success' as const };
};

/**
 * 计算二项比例的 Wilson 置信区间下界（95% 置信度）。
 *
 * 用于给"正确率"这类比例排名时，兼顾样本量：同样的正确率，回答次数越多，
 * 分数越接近真实正确率（越可信）；回答次数很少时分数会被适当压低，
 * 避免"1题全对=100%"排到"1000题对950题=95%"前面。
 */
export function getWilsonScoreLowerBound(successes: number, total: number): number {
  if (total <= 0) return 0;
  const z = 1.96; // 95% 置信度
  const p = successes / total;
  const denominator = 1 + (z * z) / total;
  const center = p + (z * z) / (2 * total);
  const margin = z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total));
  return (center - margin) / denominator;
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
  return t(`languages.${lang}`, { defaultValue: lang });
}

export function getCategoryColor(
  category: string,
): 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default' {
  switch (category) {
    case 'character':
      return 'primary';
    case 'weapon':
      return 'secondary';
    case 'artifact':
      return 'error';
    case 'lore':
      return 'info';
    case 'gameplay':
      return 'success';
    case 'world':
      return 'warning';
    case 'combat':
      return 'error';
    case 'music':
      return 'secondary';
    case 'statistics':
      return 'info';
    case 'fun':
      return 'success';
    default:
      return 'default';
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

export function createEmptyQuestionForm(languageCode: string): CreateQuestionRequest {
  return {
    public: true,
    category: Category.character,
    difficulty: Difficulty.easy,
    question_type: QuestionType.single_choice,
    question_text: { [languageCode]: '' },
    explanation: { [languageCode]: '' },
    options: [
      { option_type: 'text', text: { [languageCode]: '' }, is_answer: true },
      { option_type: 'text', text: { [languageCode]: '' }, is_answer: false },
    ],
  };
}

export function createEmptyVoteForm(languageCode: string): CreatePollRequest {
  return {
    public: true,
    title: { [languageCode]: '' },
    description: { [languageCode]: '' },
    category: Category.character,
    tags: [],
    start_at: new Date(),
    /** 每个用户最多可投票数 */
    votes_per_user: 1,
    /** 每个选项的最大可投票数，0表示无限制 */
    votes_per_option: 0,
    options: [],
  };
}

export function getLocalizedText(
  text: Record<string, string> | undefined,
  language: string,
  defaultLanguage = 'en-US',
): string {
  if (!text) return '';
  return text[language] ?? text[defaultLanguage] ?? Object.values(text)[0] ?? '';
}
