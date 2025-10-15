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
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { VoteOption } from '@/api/dto';

interface Props {
  options: VoteOption[];
  voted: string[];
  maxVotes: number;
  handleSubmit: (selected: string[]) => void;
}

export default function VoteChoices({ options, voted, maxVotes, handleSubmit }: Props) {
  const submitted = voted.length > 0;
  const [selected, setSelected] = useState<string[]>(voted);
  const [filter, setFilter] = useState<string>('');
  const [sortByVotes, setSortByVotes] = useState<'' | 'asc' | 'desc'>('');
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSelect = (id: string) => {
    if (submitted) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else if (selected.length < maxVotes) {
      setSelected([...selected, id]);
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
          {submitted ? `已投 ${voted.length} 项` : `已选 ${selectedCount}/${maxVotes}`}
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
      ...filteredItems.filter((o) => selected.includes(o.id)),
    );
  }

  const selectedCount = options.filter((option) => selected.includes(option.id)).length;

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
              <TableCell align="right">操作</TableCell>
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
              <TableRow key={item.id} hover selected={selected.includes(item.id)}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.text}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">
                  {submitted ? (
                    selected.includes(item.id) ? (
                      <Chip label="已投" color="success" size="small" />
                    ) : null
                  ) : (
                    <ToggleButtonGroup
                      value={selected}
                      onChange={() => handleSelect(item.id)}
                      size="small"
                    >
                      <ToggleButton
                        value={item.id}
                        selected={selected.includes(item.id)}
                        disabled={!selected.includes(item.id) && selected.length >= maxVotes}
                      >
                        {selected.includes(item.id) ? '取消' : '选择'}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
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
