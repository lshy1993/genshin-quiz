import type { Exam } from '@/api/dto/exam';
import type { Question } from '@/api/dto/question';
import { QuestionCategory } from '@/api/dto/questionCategory';
import { QuestionDifficulty } from '@/api/dto/questionDifficulty';
import { QuestionOptionType } from '@/api/dto/questionOptionType';
import { QuestionType } from '@/api/dto/questionType';

export const mockQuestionData: Question[] = [
  {
    id: 'ad1f5c3e-4b2e-4c3a-9f1e-2b6d7e8f9a0b',
    question_text: '原神的开发商是？',
    question_type: QuestionType.single_choice,
    category: QuestionCategory.lore,
    difficulty: QuestionDifficulty.easy,
    options: [
      { id: 'option-1', type: QuestionOptionType.text, text: 'miHoYo' },
      { id: 'option-2', type: QuestionOptionType.text, text: 'Tencent' },
      { id: 'option-3', type: QuestionOptionType.text, text: 'NetEase' },
      { id: 'option-4', type: QuestionOptionType.text, text: 'Blizzard' },
    ],
    explanation: 'miHoYo（现在叫HoYoverse）是原神的开发商',
    languages: ['zh', 'en'],
    created_by: 'user-1',
    created_at: new Date('2023-10-01T12:00:00Z'),
  },
  {
    id: 'b2f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0c',
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
    created_by: 'user-2',
    created_at: new Date('2023-10-02T12:00:00Z'),
  },
  {
    id: 'c3f5c3e2-4b2e-4c3a-9f1e-2b6d7e8f9a0d',
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
    created_by: 'user-3',
    created_at: new Date('2023-10-03T12:00:00Z'),
  },
];

export const mockExamData: Exam[] = [
  {
    id: 'quiz-1',
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
    id: 'quiz-2',
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
