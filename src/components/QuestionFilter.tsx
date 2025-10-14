import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Collapse,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { Question } from '@/api/dto';
import { allCategories, allDifficulties, allLanguages, allQuestionTypes } from '@/util/enum';
import {
  getCategoryLabel,
  getDifficultyLabel,
  getLanguageLabel,
  getQuestionTypeLabel,
} from '@/util/utils';

interface QuestionFilterProps {
  questionList: Question[];
  search: string;
  setSearch: (value: string) => void;
  selectedDifficulties: string[];
  setSelectedDifficulties: (value: string[]) => void;
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
  selectedCategory,
  setSelectedCategory,
  selectedDifficulties,
  setSelectedDifficulties,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  selectedLanguages,
  setSelectedLanguages,
  sortAsc,
  setSortAsc,
}: QuestionFilterProps) {
  // 新增本地状态控制Collapse展开
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedValues = useMemo(
    () => allLanguages.filter((v) => selectedLanguages.includes(v)),
    [allLanguages, selectedLanguages],
  );

  const renderLanguageValue = (value: readonly string[]) => {
    return value.map((option) => {
      return <Chip variant="outlined" label={getLanguageLabel(option)} key={option} />;
    });
  };

  const renderLanguageOption = (props: React.HTMLAttributes<HTMLLIElement>, option: string) => {
    return <li {...props}>{getLanguageLabel(option)}</li>;
  };

  const handleQuestionTypeToggle = (type: string) => {
    setSelectedQuestionTypes(
      selectedQuestionTypes.includes(type)
        ? selectedQuestionTypes.filter((t) => t !== type)
        : [...selectedQuestionTypes, type],
    );
  };

  const handleQuestionDifficultyToggle = (diff: string) => {
    setSelectedDifficulties(
      selectedDifficulties.includes(diff)
        ? selectedDifficulties.filter((t) => t !== diff)
        : [...selectedDifficulties, diff],
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          sx={{ height: '40px', borderRadius: '9999px', fontSize: '16px' }}
          label="全部"
          variant={selectedCategory === '' ? 'filled' : 'outlined'}
          onClick={() => setSelectedCategory('')}
          clickable
        />
        {allCategories.map((category) => (
          <Chip
            key={category}
            sx={{ height: '40px', borderRadius: '9999px', fontSize: '16px' }}
            label={getCategoryLabel(category)}
            variant={selectedCategory === category ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory(category)}
            clickable
          />
        ))}
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
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
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            sx={{ minWidth: 120 }}
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? '升序' : '降序'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ minWidth: 120 }}
            onClick={() => {
              setFilterOpen((open) => !open);
            }}
          >
            详细过滤
          </Button>
        </Stack>
        <Collapse in={filterOpen} unmountOnExit>
          <Stack direction="row" spacing={4} alignItems="center">
            <Autocomplete
              size="small"
              sx={{ minWidth: 250 }}
              multiple
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} placeholder="选择语言" />}
              options={allLanguages}
              renderOption={renderLanguageOption}
              value={selectedValues}
              renderValue={renderLanguageValue}
              onChange={(_, newValue) => setSelectedLanguages(newValue)}
            />
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
                />
              ))}
            </Stack>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
              难度等级
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {allDifficulties.map((diff) => (
                <Chip
                  key={diff}
                  label={getDifficultyLabel(diff)}
                  variant={selectedDifficulties.includes(diff) ? 'filled' : 'outlined'}
                  onClick={() => handleQuestionDifficultyToggle(diff)}
                  clickable
                />
              ))}
            </Stack>
          </Stack>
        </Collapse>
      </Box>
    </Box>
  );
}
