import z from 'zod';
import {
  Category,
  type CreatePollOptionRequest,
  type CreatePollRequest,
  Difficulty,
  OptionType,
  QuestionType,
} from '@/api/dto';

export const loginSchema = z.object({
  email: z.string().email({ message: '邮箱格式不正确' }).min(1, { message: '请输入邮箱' }),
  password: z.string().min(6, { message: '密码至少6位' }),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, { message: '请确认密码' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'],
  });

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
  category: z.enum(Category, { message: '请选择题目分类' }),
  difficulty: z.enum(Difficulty, { message: '请选择题目难度' }),
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

export const createVoteOptionSchema: z.ZodType<CreatePollOptionRequest> = z.object({
  option_type: z.enum(OptionType, { message: '请选择选项类型' }),
  text: z
    .record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '选项内容不能为空'))
    .refine((val) => Object.keys(val).length > 0, { message: '至少需要一个语言选项' }),
  description: z.record(z.string().min(1, '语言代码不能为空'), z.string()).optional(),
  media_url: z.string().optional(),
});

// Zod 验证 schema
export const createVoteSchema: z.ZodType<CreatePollRequest> = z.object({
  public: z.boolean(),
  password: z.string().optional(),
  category: z.enum(Category, { message: '请选择投票类别' }),
  title: z.record(z.string().min(1, '语言代码不能为空'), z.string().min(1, '投票标题不能为空')),
  description: z.record(z.string().min(1, '语言代码不能为空'), z.string()).optional(),
  options: z.array(createVoteOptionSchema).min(1, '至少需要1个投票项'),
  tags: z.array(z.string().min(1, '标签不能为空')).optional(),
  start_at: z.date(),
  expire_at: z.date().min(new Date(), '截止时间必须在当前时间之后').optional(),
  /** 每个用户最多可投票数 */
  votes_per_user: z.number().int().min(1, '每个用户最多可投票数必须至少为1'),
  votes_per_option: z.number().int().min(0, '每个选项的最大可投票数不能为负数'),
});

// 1. 定义 Zod 校验 Schema
export const forgotPasswordSchema = z.object({
  email: z.email({ message: '请输入有效的电子邮箱地址' }).min(1, { message: '邮箱不能为空' }),
});

// 1. 定义 Zod 校验 Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: '密码长度不能少于 6 个字符' })
      .regex(/[0-9]/, { message: '密码需包含至少一个数字' })
      .regex(/[a-zA-Z]/, { message: '密码需包含至少一个字母' }),
    confirmPassword: z.string().min(1, { message: '请再次输入密码' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'], // 错误信息指向 confirmPassword 字段
  });
