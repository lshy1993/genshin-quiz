import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { t } from 'i18next';
import { GetPollsType } from '@/api/dto';

interface VoteFilterProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: GetPollsType;
  setTypeFilter: (value: GetPollsType) => void;
}

export default function VoteFilter({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
}: VoteFilterProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label={t('filters.search_polls')}
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flex: 2 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('filters.poll_type')}</InputLabel>
        <Select
          label={t('filters.poll_type')}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value={GetPollsType.all}>{t('common.label.all')}</MenuItem>
          <MenuItem value={GetPollsType.expired}>{t('filters.poll_expired')}</MenuItem>
          <MenuItem value={GetPollsType.available}>{t('filters.poll_available')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
