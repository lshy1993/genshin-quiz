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
      { id: 'option-1', type: QuestionOptionType.text, text: { zh: 'miHoYo' }, count: 560 },
      { id: 'option-2', type: QuestionOptionType.text, text: { zh: 'Tencent' }, count: 34 },
      { id: 'option-3', type: QuestionOptionType.text, text: { zh: 'NetEase' }, count: 12 },
      { id: 'option-4', type: QuestionOptionType.text, text: { zh: 'Blizzard' }, count: 8 },
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
      { id: 'option-1', type: QuestionOptionType.text, text: { zh: 'true' }, count: 100 },
      { id: 'option-2', type: QuestionOptionType.text, text: { zh: 'false' }, count: 15 },
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
      { id: 'option-1', type: QuestionOptionType.text, text: { zh: '钟离' }, count: 90000 },
      { id: 'option-2', type: QuestionOptionType.text, text: { zh: '岩王帝君' }, count: 87000 },
      { id: 'option-3', type: QuestionOptionType.text, text: { zh: '摩拉克斯' }, count: 85000 },
    ],
    explanation: '钟离、岩王帝君、摩拉克斯都是同一个人的不同称呼',
    languages: ['zh', 'en', 'ja'],
    answer_count: 100000,
    correct_count: 90000,
    created_by: 'e1a4c2b7-8d3e-4f6a-9b2c-5f7d8e9c0a1b',
    created_at: new Date('2023-10-03T12:00:00Z'),
  },
];

export const mockQuestionAnswers = [
  {
    question_id: 'ad1f5c3e-4b2e-4c3a-9f1e-2b6d7e8f9a0b',
    answers: ['option-1'],
  },
  {
    question_id: 'b2f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0c',
    answers: ['option-1'],
  },
  {
    question_id: 'c3f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0d',
    answers: ['option-1', 'option-2', 'option-3'],
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
  {
    id: 'option-1',
    type: 'text',
    text: '派蒙',
    description: '旅行者的好伙伴',
    votes: 100,
  },
  { id: 'option-2', type: 'text', text: '空', description: '男主角', votes: 80 },
  { id: 'option-3', type: 'text', text: '荧', description: '女主角', votes: 100 },
  { id: 'option-4', type: 'text', text: '钟离', description: '岩王爷', votes: 60 },
  { id: 'option-5', type: 'text', text: '胡桃', description: '往生堂堂主', votes: 40 },
];

export const mockVotes: Vote[] = [
  {
    id: 'c8f2a7b4-3e1d-4c2f-8b9a-2d7e6f1c4b5a',
    public: true,
    category: QuestionCategory.character,
    title: '（单票制）最喜欢的角色投票',
    start_at: new Date('2025-10-10'),
    expire_at: new Date('2025-10-20'),
    votes_per_user: 3,
    options: getRandomVoteOptions(4),
    voted_options: {},
    // 以下为meta信息
    participants: 120,
    total_votes: 300,
    expired: false,
    created_at: new Date('2025-10-01'),
    created_by: '管理员A',
  },
  {
    id: 'c8f2a7b4-3e1d-4c2f-8b9a-2d7e6f1c4b5b',
    public: true,
    category: QuestionCategory.character,
    title: '（单票制）最喜欢的角色投票(已投)',
    start_at: new Date('2025-10-10'),
    expire_at: new Date('2025-10-20'),
    votes_per_user: 3,
    options: getRandomVoteOptions(4),
    voted_options: { 'option-1': 1 },
    // 以下为meta信息
    participants: 120,
    total_votes: 300,
    expired: false,
    created_at: new Date('2025-10-01'),
    created_by: '管理员A',
  },
  {
    id: 'd1b7e3c9-6f2a-4e8b-9c3d-5a2f7b8c1d4d',
    public: true,
    title: '（多票制）最强武器评选',
    category: QuestionCategory.weapon,
    start_at: new Date('2025-10-10'),
    expire_at: new Date('2025-10-20'),
    votes_per_user: 5,
    votes_per_option: 0, // 每个选项无限制
    options: getRandomVoteOptions(6),
    voted_options: {},
    // 以下为meta信息
    expired: false,
    participants: 80,
    total_votes: 200,
    created_at: new Date('2025-10-01'),
    created_by: '管理员B',
  },
  {
    id: 'd1b7e3c9-6f2a-4e8b-9c3d-5a2f7b8c1d4e',
    public: true,
    title: '（多票制）最强武器评选（已投）',
    category: QuestionCategory.weapon,
    start_at: new Date('2025-10-10'),
    expire_at: new Date('2025-10-20'),
    votes_per_user: 5,
    votes_per_option: 0, // 每个选项无限制
    options: getRandomVoteOptions(6),
    voted_options: { 'option-1': 3, 'option-3': 0, 'option-5': 2 },
    // 以下为meta信息
    expired: false,
    participants: 80,
    total_votes: 200,
    created_at: new Date('2025-10-01'),
    created_by: '管理员B',
  },
  {
    id: 'e2c3d4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f',
    public: false,
    title: '（限制2票）活动奖励选择',
    category: QuestionCategory.weapon,
    start_at: new Date('2025-10-15'),
    expire_at: new Date('2025-10-25'),
    participants: 50,
    total_votes: 150,
    votes_per_user: 5,
    votes_per_option: 2, // 每个选项最多投2票
    options: getRandomVoteOptions(3),
    voted_options: {}, // 未投
    expired: false,
    created_at: new Date('2025-10-05'),
    created_by: '管理员C',
  },
  {
    id: 'e2c3d4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7g',
    public: false,
    title: '（限制2票）活动奖励选择（已投）',
    category: QuestionCategory.weapon,
    start_at: new Date('2025-10-15'),
    expire_at: new Date('2025-10-25'),
    participants: 50,
    total_votes: 150,
    votes_per_user: 5,
    votes_per_option: 2, // 每个选项最多投2票
    options: getRandomVoteOptions(3),
    voted_options: { 'option-1': 2, 'option-3': 1 }, // 已投
    expired: false,
    created_at: new Date('2025-10-05'),
    created_by: '管理员C',
  },
];

// 随机挑选 mockVotes 中的若干项
export function getRandomVoteOptions(count: number): VoteOption[] {
  const shuffled = [...mockVoteOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
