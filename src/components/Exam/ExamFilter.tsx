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
import type { Dispatch, SetStateAction } from 'react';
import type { Exam, GetExamsParams } from '@/api/dto';
import { QuestionCategory } from '@/api/dto';
import { ExamSortType } from '@/util/enum';
import { getCategoryLabel } from '@/util/utils';

interface ExamFilterProps {
  examList: Exam[]; // 使用Exam类型
  searchParams: GetExamsParams;
  setSearchParams: Dispatch<SetStateAction<GetExamsParams>>;
}

export default function ExamFilter({ examList, searchParams, setSearchParams }: ExamFilterProps) {
  // 获取所有分类、难度
  const allCategories = Object.values(QuestionCategory);
  const allDifficulties = Array.from(new Set(examList.map((e) => e.difficulty).filter(Boolean)));

  // const handleTagToggle = (tag: string) => {
  //   setSelectedTags(
  //     selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag],
  //   );
  // };

  const handleCategoryToggle = (category: QuestionCategory | 'all') => {
    setSearchParams((prev) => {
      if (category === 'all') {
        const { category, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        category: category,
      };
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {allCategories.map((category) => (
          <Chip
            key={category}
            label={getCategoryLabel(category)}
            variant={searchParams.category?.includes(category) ? 'filled' : 'outlined'}
            onClick={() => handleCategoryToggle(category)}
            clickable
          />
        ))}
      </Stack>
      <TextField
        fullWidth
        label="搜索测验"
        variant="outlined"
        value={searchParams.query}
        onChange={(e) => setSearchParams((prev) => ({ ...prev, query: e.target.value }))}
      />

      {/* <Box>
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
      </Box> */}
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>难度</InputLabel>
          <Select
            value={searchParams.difficulty}
            label="难度"
            onChange={(e) => setSearchParams((prev) => ({ ...prev, difficulty: e.target.value }))}
          >
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
            value={searchParams.sortBy}
            label="排序"
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, sortBy: e.target.value as ExamSortType }))
            }
          >
            <MenuItem value={ExamSortType.DEFAULT}>默认</MenuItem>
            <MenuItem value={ExamSortType.TITLE}>标题</MenuItem>
            <MenuItem value={ExamSortType.DIFFICULTY}>难度</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          onClick={() => setSearchParams((prev) => ({ ...prev, sortDesc: !prev.sortDesc }))}
          color={searchParams.sortDesc ? 'primary' : 'default'}
          title={searchParams.sortDesc ? '升序' : '降序'}
        >
          <SortIcon sx={{ transform: searchParams.sortDesc ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
