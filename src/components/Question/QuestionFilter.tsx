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
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import type { GetQuestionsParams, QuestionCategory, QuestionDifficulty } from '@/api/dto';
import { allCategories, allDifficulties, allLanguages, allQuestionTypes } from '@/util/enum';
import {
  getCategoryColor,
  getCategoryLabel,
  getDifficultyLabel,
  getLanguageLabel,
  getQuestionTypeLabel,
} from '@/util/utils';

interface QuestionFilterProps {
  params: GetQuestionsParams;
  setSearchParams: Dispatch<SetStateAction<GetQuestionsParams>>;
}
export default function QuestionFilter({ params, setSearchParams }: QuestionFilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedValues = useMemo(
    () => allLanguages.filter((v) => params.language?.includes(v)),
    [allLanguages, params.language],
  );

  const renderLanguageValue = (value: readonly string[]) => {
    return value.map((option) => {
      return <Chip variant="outlined" label={getLanguageLabel(option)} key={option} />;
    });
  };

  const renderLanguageOption = (props: React.HTMLAttributes<HTMLLIElement>, option: string) => {
    return <li {...props}>{getLanguageLabel(option)}</li>;
  };

  const handleCategoryChange = (category: QuestionCategory | 'all') => {
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

  const handleLanguageToggle = (lang: string[]) => {
    setSearchParams((prev) => {
      if (lang.length === 0) {
        const { language, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        language: lang,
      };
    });
  };

  const handleQuestionTypeToggle = (type: string) => {
    setSearchParams((prev) => ({
      ...prev,
      questionTypes: type,
    }));
  };

  const handleQuestionDifficultyToggle = (diff: QuestionDifficulty | 'all') => {
    setSearchParams((prev) => {
      if (diff === 'all') {
        const { difficulty, ...rest } = prev;
        return rest;
      }
      const current = prev.difficulty ?? [];
      return {
        ...prev,
        difficulty: current.includes(diff) ? current.filter((t) => t !== diff) : [...current, diff],
      };
    });
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
          variant={params.category ? 'filled' : 'outlined'}
          onClick={() => handleCategoryChange('all')}
          clickable
        />
        {allCategories.map((category) => (
          <Chip
            key={category}
            sx={{ height: '40px', borderRadius: '9999px', fontSize: '16px' }}
            label={getCategoryLabel(category)}
            color={getCategoryColor(category)}
            variant={params.category === category ? 'filled' : 'outlined'}
            onClick={() => handleCategoryChange(category)}
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
            value={params.query || ''}
            onChange={(e) => setSearchParams((prev) => ({ ...prev, query: e.target.value }))}
            placeholder="输入题目内容进行搜索..."
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            sx={{ minWidth: 120 }}
            onClick={() => setSearchParams((prev) => ({ ...prev, sortDesc: !prev.sortDesc }))}
          >
            {params.sortDesc ? '降序' : '升序'}
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
              onChange={(_, newValue) => handleLanguageToggle(newValue)}
            />
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'medium' }}>
              题目类型
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {allQuestionTypes.map((type) => (
                <Chip
                  key={type}
                  label={getQuestionTypeLabel(type)}
                  variant={params.language?.includes(type) ? 'filled' : 'outlined'}
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
                  variant={params.difficulty?.includes(diff) ? 'filled' : 'outlined'}
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
