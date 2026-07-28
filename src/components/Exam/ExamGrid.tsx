import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Exam } from '@/api/dto';
import { useLanguage } from '@/context/LanguageContext';
import { routes } from '@/route/route';
import { getLocalizedText } from '@/util/utils';

interface Props {
  exams: Exam[];
}

export default function ExamGrid({ exams }: Props) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  // const selectedValues = useMemo(
  //   () => allLanguages.filter((v) => params.language?.includes(v)),
  //   [allLanguages, params.language],
  // );

  if (exams.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
          }}
        >
          暂无符合条件的考试
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Exam 列表 */}
      <Stack spacing={3}>
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {getLocalizedText(exam.title, currentLanguage)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                {getLocalizedText(exam.description, currentLanguage)}
              </Typography>
              <Box>
                {exam.categories?.map((cat) => (
                  <Chip key={cat} label={cat} color="secondary" size="small" sx={{ mr: 0.5 }} />
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={exam.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 2,
                }}
              >
                题目数量: {exam.questions.length}
                {exam.time_limit && ` | 时间限制: ${exam.time_limit}秒`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => {
                    navigate(routes.exam(exam.id));
                  }}
                  variant="contained"
                  size="small"
                >
                  查看详情
                </Button>
                <Button
                  onClick={() => {
                    navigate(routes.startExam(exam.id));
                  }}
                  variant="outlined"
                  size="small"
                >
                  开始考试
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  );
}
