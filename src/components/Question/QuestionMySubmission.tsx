import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import type { QuestionSubmission } from '@/util/mock';

interface Props {
  submissionList: QuestionSubmission[];
  options: QuestionOption[];
}

export default function QuestionMySubmission({ submissionList, options }: Props) {
  const sortedList = [...submissionList].sort(
    (a, b) => b.submitted_at.toMillis() - a.submitted_at.toMillis(),
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width={32}>#</TableCell>
            <TableCell width={64}>结果</TableCell>
            <TableCell>提交内容</TableCell>
            <TableCell width={200} align="right">
              时间
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedList.map((sub, idx) => (
            <TableRow
              key={sub.submitted_at.toISO()}
              sx={{ backgroundColor: idx % 2 === 0 ? 'action.hover' : 'background.paper' }}
            >
              <TableCell>{sortedList.length - idx}</TableCell>
              <TableCell>
                <Typography color={sub.correct ? 'success.main' : 'error.main'}>
                  {sub.correct ? '正确' : '错误'}
                </Typography>
              </TableCell>
              <TableCell>
                {sub.selected
                  ?.map((id) => options.find((opt) => opt.id === id)?.text || '')
                  .join('，')}
              </TableCell>
              <TableCell align="right">
                {sub.submitted_at.toFormat('yyyy-MM-dd HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
