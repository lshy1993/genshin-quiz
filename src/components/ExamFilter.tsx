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
import type { Exam } from '@/api/dto';
import { QuestionCategory } from '@/api/dto';
import { mockTags } from '@/util/mock';

interface ExamFilterProps {
  examList: Exam[]; // 使用Exam类型
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  sortBy: 'default' | 'title' | 'difficulty';
  setSortBy: (value: 'default' | 'title' | 'difficulty') => void;
  sortAsc: boolean;
  setSortAsc: (value: boolean) => void;
}

export default function ExamFilter({
  examList,
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedTags,
  setSelectedTags,
  selectedCategories,
  setSelectedCategories,
  sortBy,
  setSortBy,
  sortAsc,
  setSortAsc,
}: ExamFilterProps) {
  // 获取所有分类、难度
  const allCategories = Object.values(QuestionCategory);
  const allDifficulties = Array.from(new Set(examList.map((e) => e.difficulty).filter(Boolean)));
  const allTags = mockTags;

  const handleTagToggle = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag],
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    );
  };

  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {/* 搜索框 */}
      <TextField
        fullWidth
        label="搜索考试"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* 分类筛选 */}
      <Box sx={{ mb: 2 }}>
        <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>分类</InputLabel>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {allCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
              onClick={() => handleCategoryToggle(category)}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* 标签筛选 */}
      <Box sx={{ mb: 2 }}>
        <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>标签</InputLabel>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {allTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              onClick={() => handleTagToggle(tag)}
              clickable
            />
          ))}
        </Stack>
      </Box>

      {/* 难度和排序 */}
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>难度</InputLabel>
          <Select value={difficulty} label="难度" onChange={(e) => setDifficulty(e.target.value)}>
            <MenuItem value="">全部</MenuItem>
            {allDifficulties.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>排序</InputLabel>
          <Select
            value={sortBy}
            label="排序"
            onChange={(e) => setSortBy(e.target.value as 'default' | 'title' | 'difficulty')}
          >
            <MenuItem value="default">默认</MenuItem>
            <MenuItem value="title">标题</MenuItem>
            <MenuItem value="difficulty">难度</MenuItem>
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
