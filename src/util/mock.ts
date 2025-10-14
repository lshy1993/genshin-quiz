import { DateTime } from 'luxon';
import type { Vote, VoteOption } from '@/api/dto';
import type { Exam } from '@/api/dto/exam';
import type { Question } from '@/api/dto/question';
import { QuestionCategory } from '@/api/dto/questionCategory';
import { QuestionDifficulty } from '@/api/dto/questionDifficulty';
import { QuestionOptionType } from '@/api/dto/questionOptionType';
import { QuestionType } from '@/api/dto/questionType';

export const mockQuestionData: Question[] = [
  {
    id: 'ad1f5c3e-4b2e-4c3a-9f1e-2b6d7e8f9a0b',
    public: true,
    question_text: '原神的开发商是？',
    question_type: QuestionType.single_choice,
    category: QuestionCategory.lore,
    difficulty: QuestionDifficulty.easy,
    options: [
      { id: 'option-1', type: QuestionOptionType.text, text: 'miHoYo', count: 560 },
      { id: 'option-2', type: QuestionOptionType.text, text: 'Tencent', count: 34 },
      { id: 'option-3', type: QuestionOptionType.text, text: 'NetEase', count: 12 },
      { id: 'option-4', type: QuestionOptionType.text, text: 'Blizzard', count: 8 },
    ],
    explanation: 'miHoYo（现在叫HoYoverse）是原神的开发商',
    languages: ['zh', 'en'],
    answer_count: 1234,
    correct_count: 1100,
    created_by: 'c7e9b1a2-5f3d-4c8e-9e2a-7b6f4d2c1e8f',
    created_at: new Date('2023-10-01T12:00:00Z'),
  },
  {
    id: 'b2f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0c',
    public: true,
    question_text: '温迪是蒙德的风神',
    question_type: QuestionType.true_false,
    category: QuestionCategory.character,
    difficulty: QuestionDifficulty.easy,
    options: [
      { id: 'option-1', type: QuestionOptionType.text, text: '正确' },
      { id: 'option-2', type: QuestionOptionType.text, text: '错误' },
    ],
    explanation: '温迪确实是蒙德的风神巴巴托斯',
    languages: ['zh'],
    answer_count: 20,
    correct_count: 0,
    created_by: 'c7e9b1a2-5f3d-4c8e-9e2a-7b6f4d2c1e8f',
    created_at: new Date('2023-10-02T12:00:00Z'),
  },
  {
    id: 'c3f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0d',
    public: true,
    question_text: '璃月港的守护神是？',
    question_type: QuestionType.multiple_choice,
    category: QuestionCategory.lore,
    difficulty: QuestionDifficulty.medium,
    options: [
      { id: 'option-1', type: QuestionOptionType.text, text: '钟离' },
      { id: 'option-2', type: QuestionOptionType.text, text: '岩王帝君' },
      { id: 'option-3', type: QuestionOptionType.text, text: '摩拉克斯' },
      { id: 'option-4', type: QuestionOptionType.text, text: '以上都是' },
    ],
    explanation: '钟离、岩王帝君、摩拉克斯都是同一个人的不同称呼',
    languages: ['zh', 'en', 'ja'],
    answer_count: 100000,
    correct_count: 90000,
    created_by: 'e1a4c2b7-8d3e-4f6a-9b2c-5f7d8e9c0a1b',
    created_at: new Date('2023-10-03T12:00:00Z'),
  },
];

export type QuestionSubmission = {
  user_name: string;
  selected?: string[];
  correct: boolean;
  submitted_at: DateTime;
};

export const mockRecentQuestionSubmissions: QuestionSubmission[] = [
  { user_name: '小明', correct: true, submitted_at: DateTime.now() },
  { user_name: 'Alice', correct: false, submitted_at: DateTime.now() },
  { user_name: 'Bob', correct: true, submitted_at: DateTime.now() },
];

export const mockExamData: Exam[] = [
  {
    id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
    public: true,
    title: '原神基础知识测验',
    description: '测试你对原神基础知识的掌握程度。',
    categories: [QuestionCategory.lore],
    difficulty: QuestionDifficulty.easy,
    questions: [
      { question_id: 'ad1f5c3e-4b2e-4c3a-9f1e-2b6d7e8f9a0b', order_index: 1, points: 10 },
      { question_id: 'b2f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0c', order_index: 2, points: 5 },
    ],
    time_limit: 60,
    created_by: 'user-1',
    created_at: new Date('2023-10-01T12:00:00Z'),
    updated_at: new Date('2023-10-01T12:00:00Z'),
  },
  {
    id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d',
    public: true,
    title: '角色技能挑战',
    description: '考验你对角色技能的理解。',
    categories: [QuestionCategory.character],
    difficulty: QuestionDifficulty.medium,
    questions: [
      { question_id: 'c3f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0d', order_index: 1, points: 15 },
    ],
    time_limit: 90,
    created_by: 'user-2',
    created_at: new Date('2023-10-02T12:00:00Z'),
    updated_at: new Date('2023-10-02T12:00:00Z'),
  },
  {
    id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
    public: false,
    title: '高级剧情测验',
    description: '深入了解原神的剧情发展。',
    categories: [QuestionCategory.lore, QuestionCategory.character],
    difficulty: QuestionDifficulty.hard,
    questions: [
      { question_id: 'ad1f5c3e-4b2e-4c3a-9f1e-2b6d7e8f9a0b', order_index: 1, points: 20 },
      { question_id: 'c3f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0d', order_index: 2, points: 25 },
    ],
    time_limit: 120,
    created_by: 'user-3',
    created_at: new Date('2023-10-03T12:00:00Z'),
    updated_at: new Date('2023-10-03T12:00:00Z'),
  },
];

export const mockTags = [
  '原神',
  '角色',
  '技能',
  '剧情',
  '活动',
  '武器',
  '圣遗物',
  '元素',
  '挑战',
  '探索',
];

export const mockVoteOptions: VoteOption[] = [
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', text: '选项1', type: 'text' },
  { id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', text: '选项2', type: 'text' },
  { id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', text: '选项3', type: 'text' },
  { id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', text: '选项4', type: 'text' },
  { id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', text: '选项5', type: 'text' },
  { id: 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', text: '选项6', type: 'text' },
  { id: 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', text: '选项7', type: 'text' },
  { id: 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', text: '选项8', type: 'text' },
  { id: 'c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', text: '选项9', type: 'text' },
  { id: 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', text: '选项10', type: 'text' },
];

// 随机挑选 mockVotes 中的若干项
export function getRandomVoteOptions(count: number): VoteOption[] {
  const shuffled = [...mockVoteOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const mockVotes: Vote[] = [
  {
    id: 'c8f2a7b4-3e1d-4c2f-8b9a-2d7e6f1c4b5a',
    public: true,
    title: '最喜欢的角色投票',
    created_at: new Date('2025-10-01'),
    created_by: '管理员A',
    expires_at: new Date('2025-10-20'),
    participants: 120,
    total_votes: 300,
    votes_per_user: 1,
    options: getRandomVoteOptions(4),
    // tags: ['角色', '人气'],
    expired: false,
  },
  {
    id: 'd1b7e3c9-6f2a-4e8b-9c3d-5a2f7b8c1d4e',
    public: true,
    title: '最强武器评选',
    created_at: new Date('2025-10-01'),
    created_by: '管理员B',
    expires_at: new Date('2025-10-20'),
    participants: 80,
    total_votes: 200,
    votes_per_user: 3,
    options: getRandomVoteOptions(6),
    expired: true,
  },
  {
    id: 'e2c3d4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f',
    public: false,
    title: '活动奖励选择',
    created_at: new Date('2025-10-05'),
    created_by: '管理员C',
    expires_at: new Date('2025-10-25'),
    participants: 50,
    total_votes: 150,
    votes_per_user: 1,
    options: getRandomVoteOptions(3),
    expired: false,
  },
];
