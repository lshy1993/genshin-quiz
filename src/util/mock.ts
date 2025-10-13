import type { Question, Quiz } from '@/api/dto';
import { QuestionQuestionType, QuizCategory, QuizDifficulty } from '@/api/dto';

export const mockTags = ['知识', '趣味', '挑战', '基础', '进阶'];

// 单个题目的模拟数据
export const mockQuestionData: (Question & {
  category: QuizCategory;
  difficulty: QuizDifficulty;
  answerCount: number;
  correctRate: number;
  availableLanguages: string[]; // 支持的语言
})[] = [
  {
    id: 1,
    question_text: '原神的开发商是？',
    question_type: QuestionQuestionType.multiple_choice,
    options: ['miHoYo', 'Tencent', 'NetEase', 'Blizzard'],
    correct_answer: 'miHoYo',
    explanation: 'miHoYo（现在叫HoYoverse）是原神的开发商',
    points: 10,
    order_index: 1,
    category: QuizCategory.lore,
    difficulty: QuizDifficulty.easy,
    answerCount: 1250,
    correctRate: 0.85,
    availableLanguages: ['zh', 'en', 'ja'],
  },
  {
    id: 2,
    question_text: '温迪是蒙德的风神',
    question_type: QuestionQuestionType.true_false,
    correct_answer: 'true',
    explanation: '温迪确实是蒙德的风神巴巴托斯',
    points: 5,
    order_index: 2,
    category: QuizCategory.characters,
    difficulty: QuizDifficulty.easy,
    answerCount: 980,
    correctRate: 0.92,
    availableLanguages: ['zh', 'en'],
  },
  {
    id: 3,
    question_text: '璃月港的守护神是？',
    question_type: QuestionQuestionType.multiple_choice,
    options: ['钟离', '岩王帝君', '摩拉克斯', '以上都是'],
    correct_answer: '以上都是',
    explanation: '钟离、岩王帝君、摩拉克斯都是同一个人的不同称呼',
    points: 15,
    order_index: 3,
    category: QuizCategory.lore,
    difficulty: QuizDifficulty.medium,
    answerCount: 756,
    correctRate: 0.68,
    availableLanguages: ['zh'],
  },
  {
    id: 4,
    question_text: '原神中最高等级是多少？',
    question_type: QuestionQuestionType.single_choice,
    correct_answer: '90',
    explanation: '目前原神中角色和武器的最高等级都是90级',
    points: 10,
    order_index: 4,
    category: QuizCategory.gameplay,
    difficulty: QuizDifficulty.medium,
    answerCount: 643,
    correctRate: 0.73,
    availableLanguages: ['zh', 'en', 'ja'],
  },
  {
    id: 5,
    question_text: '下列哪个元素反应能造成最高伤害？',
    question_type: QuestionQuestionType.multiple_choice,
    options: ['蒸发', '融化', '超载', '扩散'],
    correct_answer: '融化',
    explanation: '在合适的条件下，融化反应能造成2倍伤害，是最高的增伤反应',
    points: 20,
    order_index: 5,
    category: QuizCategory.combat,
    difficulty: QuizDifficulty.hard,
    answerCount: 432,
    correctRate: 0.45,
    availableLanguages: ['zh', 'en'],
  },
];

export const mockQuizData: Quiz[] = [
  {
    id: 1,
    title: '原神基础知识测验',
    description: '测试你对原神基础知识的掌握程度。',
    difficulty: QuizDifficulty.easy,
    category: QuizCategory.lore,
    questions: [],
    time_limit: 60,
    created_by: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: '角色技能挑战',
    description: '考验你对角色技能的理解。',
    difficulty: QuizDifficulty.medium,
    category: QuizCategory.characters,
    questions: [],
    time_limit: 90,
    created_by: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    title: '趣味冷知识',
    description: '你知道这些有趣的冷知识吗？',
    difficulty: QuizDifficulty.hard,
    category: QuizCategory.gameplay,
    questions: [],
    time_limit: 120,
    created_by: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
];
