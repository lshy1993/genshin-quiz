import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';

// 假数据
const voteInfo = {
  title: '最喜欢的角色投票',
  startTime: '2025-10-01',
  endTime: '2025-10-20',
  participants: 120,
  votes: 300,
  type: '多选',
  tags: ['角色', '人气'],
  author: '管理员A',
  maxVotes: 3,
  userVoted: false,
  userVotes: [2], // 已投项目id
};

const voteItems = [
  { id: 1, name: '派蒙', votes: 120, desc: '旅行者的好伙伴' },
  { id: 2, name: '空', votes: 80, desc: '男主角' },
  { id: 3, name: '荧', votes: 100, desc: '女主角' },
  { id: 4, name: '钟离', votes: 60, desc: '岩王爷' },
  { id: 5, name: '胡桃', votes: 40, desc: '往生堂堂主' },
];

export default function VoteDetailPage() {
  const [filter, setFilter] = useState('');
  const [sortByVotes, setSortByVotes] = useState(false);
  const [selected, setSelected] = useState<number[]>(voteInfo.userVoted ? voteInfo.userVotes : []);
  const [submitted, setSubmitted] = useState(voteInfo.userVoted);

  // 过滤和排序
  let filteredItems = voteItems.filter(
    (item) => item.name.includes(filter) || item.desc.includes(filter),
  );
  if (sortByVotes) {
    filteredItems = [...filteredItems].sort((a, b) => b.votes - a.votes);
  }

  // 投票类型
  const isMulti = voteInfo.type === '多选';
  const maxVotes = voteInfo.maxVotes;

  // 统计
  const votesLeft = maxVotes - selected.length;

  // 交互
  const handleSelect = (id: number) => {
    if (submitted) return;
    if (isMulti) {
      if (selected.includes(id)) {
        setSelected(selected.filter((i) => i !== id));
      } else if (selected.length < maxVotes) {
        setSelected([...selected, id]);
      }
    } else {
      setSelected([id]);
    }
  };

  const handleSubmit = () => {
    // 这里应调用接口提交 selected
    setSubmitted(true);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      {/* 投票信息 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {voteInfo.title}
        </Typography>
        <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
          <Typography variant="body2" color="text.secondary">
            时间：{voteInfo.startTime} ~ {voteInfo.endTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            参与人数：{voteInfo.participants}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            总票数：{voteInfo.votes}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            类型：{voteInfo.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            作者：{voteInfo.author}
          </Typography>
        </Stack>
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {voteInfo.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </Paper>

      {/* 过滤和排序 */}
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField
          label="关键词过滤"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          variant={sortByVotes ? 'contained' : 'outlined'}
          startIcon={<SortIcon />}
          onClick={() => setSortByVotes((v) => !v)}
        >
          按票数排序
        </Button>
      </Stack>

      {/* 投票统计 */}
      <Box mb={2}>
        <Typography>
          {submitted
            ? `你已投票：${selected.length} 项`
            : `你已选中：${selected.length} 项，还可投 ${votesLeft} 项`}
        </Typography>
      </Box>

      {/* 投票项目表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>选项</TableCell>
              <TableCell>简介</TableCell>
              <TableCell align="right">票数</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover selected={selected.includes(item.id)}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.desc}</TableCell>
                <TableCell align="right">{item.votes}</TableCell>
                <TableCell align="center">
                  {submitted ? (
                    selected.includes(item.id) ? (
                      <Chip label="已投" color="success" size="small" />
                    ) : null
                  ) : (
                    <ToggleButtonGroup
                      value={selected}
                      exclusive={!isMulti}
                      onChange={() => handleSelect(item.id)}
                      size="small"
                    >
                      <ToggleButton
                        value={item.id}
                        selected={selected.includes(item.id)}
                        disabled={
                          !selected.includes(item.id) && isMulti && selected.length >= maxVotes
                        }
                      >
                        选择
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 提交按钮 */}
      {!submitted && (
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            disabled={selected.length === 0}
            onClick={handleSubmit}
          >
            提交投票
          </Button>
        </Box>
      )}

      {/* 分析统计 */}
      <Divider sx={{ my: 4 }} />
      <Box>
        <Typography variant="h6" gutterBottom>
          投票结果分析
        </Typography>
        {/* 这里可以放图表或统计信息 */}
        <Box>
          {voteItems.map((item) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography variant="body2">
                {item.name}：{item.votes} 票
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    ml: 1,
                    width: `${(item.votes / voteInfo.votes) * 100}%`,
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
