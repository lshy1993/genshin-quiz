import {
  Box,
  Button,
  Chip,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  ToggleButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { VoteOption, VoteVotedOptions } from '@/api/dto';

interface Props {
  options: VoteOption[];
  voted: VoteVotedOptions;
  maxVotes: number;
  votesPerOption: number; // 每个选项最大可投票数
  handleSubmit: (selected: VoteVotedOptions) => void;
}

export default function VoteChoices({
  options,
  voted,
  maxVotes,
  votesPerOption,
  handleSubmit,
}: Props) {
  const submitted = Object.values(voted).some((count) => count > 0);
  const [selected, setSelected] = useState<VoteVotedOptions>(voted);
  const [filter, setFilter] = useState<string>('');
  const [sortByVotes, setSortByVotes] = useState<'' | 'asc' | 'desc'>('');
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAdd = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
  };

  const handleSelect = (id: string) => {
    // 单选
    if (submitted) return;
    if (selected[id]) {
      setSelected((prev) => {
        const newSelected = { ...prev };
        delete newSelected[id];
        return newSelected;
      });
    } else {
      setSelected((prev) => ({
        ...prev,
        [id]: 1,
      }));
    }
  };

  const handleClickSubmit = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    handleSubmit(selected);
  };

  const renderVoting = () => {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>
          {submitted ? '已投' : '已选'}
          {` ${selectedCount}/${maxVotes}`}
        </Typography>
        <Chip
          label={'仅看已选'}
          color={showSelectedOnly ? 'primary' : 'default'}
          variant={showSelectedOnly ? 'filled' : 'outlined'}
          clickable
          onClick={() => setShowSelectedOnly((prev) => !prev)}
          sx={{
            height: 32,
            fontSize: 14,
            borderStyle: showSelectedOnly ? 'solid' : 'dashed',
          }}
          onDelete={showSelectedOnly ? () => setShowSelectedOnly(false) : undefined}
        />
      </Stack>
    );
  };

  const renderResult = (option: VoteOption) => {
    const votesForThisOption = voted[option.id] || 0;
    if (votesForThisOption > 0) {
      return (
        <Chip
          label={votesPerOption === 1 ? '已投' : `${votesForThisOption}票`}
          color="success"
          size="small"
        />
      );
    }
    return null;
  };

  const renderAction = (option: VoteOption) => {
    if (votesPerOption === 1) {
      const isVoted = option.id in selected && selected[option.id] > 0;
      return (
        <ToggleButton
          size="small"
          value={option.id}
          selected={isVoted}
          disabled={!isVoted && selectedCount >= maxVotes}
          onClick={() => handleSelect(option.id)}
        >
          {isVoted ? '取消' : '选择'}
        </ToggleButton>
      );
    } else {
      // 多选
      const votesForThisOption = selected[option.id] || 0;
      const overOptionMax = votesPerOption > 0 && votesForThisOption >= votesPerOption;
      const overUserMax = selectedCount >= maxVotes;
      return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleRemove(option.id)}
            disabled={votesForThisOption < 1}
            sx={{ minWidth: 32 }}
          >
            -
          </Button>
          <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{votesForThisOption}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleAdd(option.id)}
            disabled={overOptionMax || overUserMax}
            sx={{ minWidth: 32 }}
          >
            +
          </Button>
        </Stack>
      );
    }
  };

  const filteredItems = options.filter(
    (option) => option.text?.includes(filter) || option.description?.includes(filter),
  );
  if (sortByVotes !== '') {
    filteredItems.sort((a, b) =>
      sortByVotes === 'asc' ? (a.votes ?? 0) - (b.votes ?? 0) : (b.votes ?? 0) - (a.votes ?? 0),
    );
  }
  if (showSelectedOnly) {
    filteredItems.splice(
      0,
      filteredItems.length,
      ...filteredItems.filter((o) => selected[o.id] > 0),
    );
  }

  const selectedCount = Object.values(selected).reduce((acc, count) => acc + count, 0);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <TextField
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="搜索选项，简介"
        />
        {renderVoting()}
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>选项</TableCell>
              <TableCell>简介</TableCell>
              <TableCell align="right">投票</TableCell>
              {submitted && (
                <TableCell align="right" sortDirection={sortByVotes === '' ? false : sortByVotes}>
                  <TableSortLabel
                    active={sortByVotes !== ''}
                    direction={sortByVotes === '' ? 'asc' : sortByVotes}
                    onClick={() => setSortByVotes((v) => (v === 'asc' ? 'desc' : 'asc'))}
                  >
                    票数
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={item.id} hover selected={selected[item.id] > 0}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.text}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">
                  {submitted ? renderResult(item) : renderAction(item)}
                </TableCell>
                {submitted && <TableCell align="right">{item.votes}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!submitted && (
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            disabled={selected.length === 0}
            onClick={handleClickSubmit}
          >
            {`提交投票 (${selectedCount}/${maxVotes})`}
          </Button>
        </Box>
      )}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Stack
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // width: 400,
            bgcolor: 'background.paper',
            // border: '2px solid #000',
            boxShadow: 24,
            p: 3,
          }}
          spacing={2}
        >
          <Typography variant="h6">你确定要提交这 {selectedCount} 票吗？</Typography>
          {selectedCount < maxVotes && (
            <Typography variant="body2" color="text.secondary">
              你还可以选择 {maxVotes - selectedCount} 票
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setConfirmOpen(false)}
            >
              取消
            </Button>
            <Button size="small" variant="outlined" color="primary" onClick={handleConfirm}>
              确认
            </Button>
          </Box>
        </Stack>
      </Modal>
    </>
  );
}
