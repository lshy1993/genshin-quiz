import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { Question, QuizCategory, QuizDifficulty } from '@/api/dto';
import { QuestionQuestionType } from '@/api/dto';

interface QuestionFilterProps {
  questionList: (Question & {
    category: QuizCategory;
    difficulty: QuizDifficulty;
    answerCount: number;
    correctRate: number;
  })[];
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  selectedQuestionTypes: string[];
  setSelectedQuestionTypes: (value: string[]) => void;
  sortBy: 'default' | 'difficulty' | 'category' | 'answerCount' | 'correctRate';
  setSortBy: (value: 'default' | 'difficulty' | 'category' | 'answerCount' | 'correctRate') => void;
  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;
}

export default function QuestionFilter({
  questionList,
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedCategories,
  setSelectedCategories,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  sortBy,
  setSortBy,
  sortAsc,
  setSortAsc,
}: QuestionFilterProps) {
  // 获取所有分类、难度、题型
  const allCategories = Array.from(new Set(questionList.map((q) => q.category).filter(Boolean)));
  const allDifficulties = Array.from(
    new Set(questionList.map((q) => q.difficulty).filter(Boolean)),
  );
  const allQuestionTypes = Object.values(QuestionQuestionType);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    );
  };

  const handleQuestionTypeToggle = (type: string) => {
    setSelectedQuestionTypes(
      selectedQuestionTypes.includes(type)
        ? selectedQuestionTypes.filter((t) => t !== type)
        : [...selectedQuestionTypes, type],
    );
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return '单选题';
      case 'true_false':
        return '判断题';
      case 'fill_in_blank':
        return '填空题';
      default:
        return type;
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return diff;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lore':
        return '剧情背景';
      case 'characters':
        return '角色';
      case 'gameplay':
        return '游戏玩法';
      case 'items':
        return '物品道具';
      case 'events':
        return '活动';
      default:
        return category;
    }
  };

  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {/* 搜索框 */}
      <TextField
        fullWidth
        label="搜索题目"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="输入题目内容进行搜索..."
      />

      {/* 分类筛选 */}
      <Box sx={{ mb: 2 }}>
        <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>题目分类</InputLabel>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {allCategories.map((category) => (
            <Chip
              key={category}
              label={getCategoryLabel(category)}
              variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
              onClick={() => handleCategoryToggle(category)}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* 题型筛选 */}
      <Box sx={{ mb: 2 }}>
        <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>题目类型</InputLabel>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {allQuestionTypes.map((type) => (
            <Chip
              key={type}
              label={getQuestionTypeLabel(type)}
              variant={selectedQuestionTypes.includes(type) ? 'filled' : 'outlined'}
              onClick={() => handleQuestionTypeToggle(type)}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* 难度和排序 */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>难度</InputLabel>
          <Select value={difficulty} label="难度" onChange={(e) => setDifficulty(e.target.value)}>
            <MenuItem value="">全部</MenuItem>
            {allDifficulties.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {getDifficultyLabel(diff)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>排序方式</InputLabel>
          <Select
            value={sortBy}
            label="排序方式"
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | 'default'
                  | 'difficulty'
                  | 'category'
                  | 'answerCount'
                  | 'correctRate',
              )
            }
          >
            <MenuItem value="default">默认</MenuItem>
            <MenuItem value="difficulty">难度</MenuItem>
            <MenuItem value="category">分类</MenuItem>
            <MenuItem value="answerCount">回答人次</MenuItem>
            <MenuItem value="correctRate">正确率</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          onClick={() => setSortAsc(!sortAsc)}
          color={sortAsc ? 'primary' : 'default'}
          title={sortAsc ? '升序' : '降序'}
        >
          <SortIcon sx={{ transform: sortAsc ? 'rotate(0deg)' : 'rotate(180deg)' }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
