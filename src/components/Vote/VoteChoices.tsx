import {
  Box,
  Button,
  Chip,
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
import { t } from 'i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PollOption, PollVote } from '@/api/dto';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { routes } from '@/route/route';
import { getLocalizedText } from '@/util/utils';

interface Props {
  options: PollOption[];
  voted: PollVote[];
  maxVotes: number;
  votesPerOption: number; // 每个选项最大可投票数
  votesPerUser: number; // 每个用户最大可投票数
  handleSubmit: (selected: PollVote[]) => void;
}

export default function VoteChoices({
  options,
  voted = [],
  maxVotes,
  votesPerOption,
  votesPerUser,
  handleSubmit,
}: Props) {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  // 将数组格式转换为对象格式方便使用
  const votedMap = Object.fromEntries(voted.map((v) => [v.option_id, v.votes]));
  const submitted = voted.length > 0;
  const [selected, setSelected] = useState<{ [key: string]: number }>(votedMap);

  const [filter, setFilter] = useState<string>('');
  const [sortByVotes, setSortByVotes] = useState<'' | 'asc' | 'desc'>('');
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAdd = (id: string | undefined) => {
    if (!id) return;
    setSelected((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string | undefined) => {
    if (!id) return;
    setSelected((prev) => ({
      ...prev,
      [id]: prev[id] - 1,
    }));
  };

  const handleSelect = (id: string | undefined) => {
    if (!id) return;
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

  const handleLogin = () => {
    navigate(routes.login());
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    // 将对象格式转换为 VoteSubmissionOption[]
    const options: PollVote[] = Object.entries(selected).map(([option_id, votes]) => ({
      option_id,
      votes,
    }));
    handleSubmit(options);
  };

  const renderVoting = () => {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography>
          {submitted ? t('vote.voted') : t('vote.selected')}
          {` ${selectedCount}/${maxVotes}`}
        </Typography>
        <Chip
          label={
            votesPerOption === 0
              ? t('vote.per_item_limit', { count: votesPerUser })
              : votesPerOption === 1
                ? t('vote.per_item_limit', { count: 1 })
                : t('vote.per_item_limit', { count: votesPerOption })
          }
          color="info"
          variant="outlined"
          size="small"
        />
      </Stack>
    );
  };

  const renderResult = (option: PollOption) => {
    if (!option.id) return null;
    const votesForThisOption = selected[option.id] || 0;
    if (votesForThisOption > 0) {
      return (
        <Chip
          label={t('vote.voted_count', { count: votesForThisOption })}
          color="success"
          size="small"
        />
      );
    }
    return null;
  };

  const renderAction = (option: PollOption) => {
    if (!option.id) return null;
    if (votesPerOption === 1) {
      const isVoted = option.id in selected && selected[option.id] > 0;
      return (
        <ToggleButton
          size="small"
          value={option.id}
          selected={isVoted}
          disabled={!isAuthenticated || (!isVoted && selectedCount >= maxVotes)}
          onClick={() => handleSelect(option.id)}
        >
          {isVoted ? t('common.btn_label.cancel') : t('vote.select')}
        </ToggleButton>
      );
    } else {
      // 多选
      const votesForThisOption = selected[option.id] || 0;
      const overOptionMax = votesPerOption > 0 && votesForThisOption >= votesPerOption;
      const overUserMax = selectedCount >= maxVotes;
      const displayText =
        votesPerOption > 0 ? `${votesForThisOption}/${votesPerOption}` : votesForThisOption;
      return (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleRemove(option.id)}
            disabled={!isAuthenticated || votesForThisOption < 1}
            sx={{ minWidth: 32 }}
          >
            -
          </Button>
          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>{displayText}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleAdd(option.id)}
            disabled={!isAuthenticated || overOptionMax || overUserMax}
            sx={{ minWidth: 32 }}
          >
            +
          </Button>
        </Stack>
      );
    }
  };

  const filteredItems = options.filter((option) => {
    const text = getLocalizedText(option.text, currentLanguage);
    const desc = getLocalizedText(option.description, currentLanguage);
    return text.includes(filter) || desc.includes(filter);
  });
  if (sortByVotes !== '') {
    filteredItems.sort((a, b) =>
      sortByVotes === 'asc' ? a.votes_count - b.votes_count : b.votes_count - a.votes_count,
    );
  }
  if (showSelectedOnly) {
    filteredItems.splice(
      0,
      filteredItems.length,
      ...filteredItems.filter((o) => o.id && selected[o.id] > 0),
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
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={t('vote.show_selected_only')}
            color={showSelectedOnly ? 'primary' : 'default'}
            variant={showSelectedOnly ? 'filled' : 'outlined'}
            clickable
            onClick={() => setShowSelectedOnly((prev) => !prev)}
            sx={{
              borderStyle: showSelectedOnly ? 'solid' : 'dashed',
            }}
            onDelete={showSelectedOnly ? () => setShowSelectedOnly(false) : undefined}
          />
          <TextField
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t('vote.search_options')}
          />
        </Box>
        {renderVoting()}
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('common.label.option')}</TableCell>
              <TableCell>{t('common.label.description')}</TableCell>
              <TableCell align="right">{t('common.label.votes')}</TableCell>
              {submitted && isAuthenticated && (
                <TableCell align="right" sortDirection={sortByVotes === '' ? false : sortByVotes}>
                  <TableSortLabel
                    active={sortByVotes !== ''}
                    direction={sortByVotes === '' ? 'asc' : sortByVotes}
                    onClick={() => setSortByVotes((v) => (v === 'asc' ? 'desc' : 'asc'))}
                  >
                    {t('vote.total_votes')}
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow
                key={item.id || index}
                hover
                selected={item.id ? selected[item.id] > 0 : false}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{getLocalizedText(item.text, currentLanguage)}</TableCell>
                <TableCell>{getLocalizedText(item.description, currentLanguage)}</TableCell>
                <TableCell align="right">
                  {submitted ? renderResult(item) : renderAction(item)}
                </TableCell>
                {submitted && isAuthenticated && (
                  <TableCell align="right">{item.votes_count}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!submitted && (
        <Box
          sx={{
            mt: 3,
            textAlign: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={isAuthenticated && selectedCount === 0}
            onClick={isAuthenticated ? handleClickSubmit : handleLogin}
          >
            {!isAuthenticated
              ? t('vote.login_required')
              : t('vote.submit', { selected: selectedCount, max: maxVotes })}
          </Button>
        </Box>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('vote.confirm_submit_title', { count: selectedCount })}
        cancelLabel={t('common.btn_label.cancel')}
        confirmLabel={t('common.btn_label.confirm')}
        onConfirm={handleConfirm}
      >
        {selectedCount < maxVotes && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('vote.confirm_remaining_votes', { count: maxVotes - selectedCount })}
          </Typography>
        )}
      </ConfirmDialog>
    </>
  );
}
