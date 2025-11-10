import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { GetVotesType } from '@/api/dto';

interface VoteFilterProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: GetVotesType;
  setTypeFilter: (value: GetVotesType) => void;
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
        label="搜索投票"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flex: 2 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>类型</InputLabel>
        <Select label="类型" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <MenuItem value={GetVotesType.all}>全部</MenuItem>
          <MenuItem value={GetVotesType.expired}>已经结束</MenuItem>
          <MenuItem value={GetVotesType.available}>进行中</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
