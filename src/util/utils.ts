import { t } from 'i18next';
import type { Question } from '@/api/dto';

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
