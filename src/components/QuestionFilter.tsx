import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { type Question, QuestionCategory, QuestionDifficulty, QuestionType } from '@/api/dto';

interface QuestionFilterProps {
  questionList: Question[];
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedQuestionTypes: string[];
  setSelectedQuestionTypes: (value: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (value: string[]) => void;

  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;
}
export default function QuestionFilter({
  questionList,
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedCategory,
  setSelectedCategory,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  selectedLanguages,
  setSelectedLanguages,
  sortAsc,
  setSortAsc,
}: QuestionFilterProps) {
  // 获取所有分类、难度、题型、语言
  const allCategories = Object.values(QuestionCategory);
  const allDifficulties = Object.values(QuestionDifficulty);
  const allQuestionTypes = Object.values(QuestionType);
  const allLanguages = Array.from(
    new Set(questionList.flatMap((q) => q.languages).filter(Boolean)),
  );

  const handleQuestionTypeToggle = (type: string) => {
    setSelectedQuestionTypes(
      selectedQuestionTypes.includes(type)
        ? selectedQuestionTypes.filter((t) => t !== type)
        : [...selectedQuestionTypes, type],
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(
      selectedLanguages.includes(lang)
        ? selectedLanguages.filter((l) => l !== lang)
        : [...selectedLanguages, lang],
    );
  };

  const getQuestionTypeLabel = (type: string) => {
    return t(`question.type.${type}`);
  };

  const getDifficultyLabel = (diff: string) => {
    return t(`question.difficulty.${diff}`);
  };

  const getCategoryLabel = (category: string) => {
    return t(`question.category.${category}`);
  };

  const getLanguageLabel = (lang: string) => {
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
  };

  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {/* 分类筛选 - 单选，方形chip，单独一行 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
          题目分类
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip
            label="全部"
            variant={selectedCategory === '' ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory('')}
            clickable
            sx={{ borderRadius: 1 }}
          />
          {allCategories.map((category) => (
            <Chip
              key={category}
              label={getCategoryLabel(category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory(category)}
              clickable
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {/* 题型和难度筛选 - 同一行 */}
      <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
        {/* 题型筛选 - 多选 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
            题目类型
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {allQuestionTypes.map((type) => (
              <Chip
                key={type}
                label={getQuestionTypeLabel(type)}
                variant={selectedQuestionTypes.includes(type) ? 'filled' : 'outlined'}
                onClick={() => handleQuestionTypeToggle(type)}
                clickable
                size="small"
              />
            ))}
          </Stack>
        </Box>

        {/* 难度筛选 - 多选 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
            难度等级
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {allDifficulties.map((diff) => (
              <Chip
                key={diff}
                label={getDifficultyLabel(diff)}
                variant={difficulty === diff ? 'filled' : 'outlined'}
                onClick={() => setDifficulty(difficulty === diff ? '' : diff)}
                clickable
                size="small"
              />
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* 关键词搜索 + 语言单选 - 最下面，右侧有按钮，语言优先级最低 */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          fullWidth
          label="搜索题目"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="输入题目内容进行搜索..."
          size="small"
        />
        {/* 语言单选 */}
        <TextField
          select
          label="语言"
          value={selectedLanguages[0] || ''}
          onChange={(e) => setSelectedLanguages(e.target.value ? [e.target.value] : [])}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <option value="">全部</option>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {getLanguageLabel(lang)}
            </option>
          ))}
        </TextField>
        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          sx={{ minWidth: 120 }}
          onClick={() => setSortAsc(!sortAsc)}
        >
          {sortAsc ? '升序' : '降序'}
        </Button>
        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ minWidth: 120 }}>
          详细过滤
        </Button>
      </Stack>
    </Box>
  );
}
