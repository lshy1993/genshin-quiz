import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { QuestionOption } from '@/api/dto';
import { useGetQuestionMySubmissions } from '@/api/genshinQuizAPI';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  questionId: string;
  options: QuestionOption[];
}

export default function QuestionMySubmission({ questionId, options }: Props) {
  const { currentLanguage } = useLanguage();
  const {
    data: submissionList,
    isLoading: isSubmissionsLoading,
    error: submissionsErr,
  } = useGetQuestionMySubmissions(questionId);

  if (isSubmissionsLoading) {
    return <CircularProgress />;
  }
  if (submissionsErr || !submissionList) {
    console.error('Failed to load submissions:', submissionsErr);
    return <Alert severity="error">加载题目失败</Alert>;
  }

  const optionMap = new Map<string, string>();
  options.forEach((opt) => {
    if (opt.id) {
      optionMap.set(opt.id, opt.text?.[currentLanguage] ?? '');
    }
  });

  const renderOptionText = (options: string[]) => {
    return options.map((id) => optionMap.get(id) ?? '').join(' ');
  };

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
          {submissionList.map((sub, idx) => (
            <TableRow
              key={sub.submitted_at.toISOString()}
              sx={{ backgroundColor: idx % 2 === 0 ? 'action.hover' : 'background.paper' }}
            >
              <TableCell>{submissionList.length - idx}</TableCell>
              <TableCell>
                <Typography color={sub.is_correct ? 'success.main' : 'error.main'}>
                  {sub.is_correct ? '正确' : '错误'}
                </Typography>
              </TableCell>
              <TableCell>{renderOptionText(sub.selected_option_ids)}</TableCell>
              <TableCell align="right">{sub.submitted_at.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
