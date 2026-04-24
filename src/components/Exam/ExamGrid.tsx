import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Exam } from '@/api/dto';

interface Props {
  exams: Exam[];
}

export default function ExamGrid({ exams }: Props) {
  const navigate = useNavigate();

  // const selectedValues = useMemo(
  //   () => allLanguages.filter((v) => params.language?.includes(v)),
  //   [allLanguages, params.language],
  // );

  if (exams.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          暂无符合条件的考试
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Exam 列表 */}
      <Grid container spacing={3}>
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {exam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {exam.description}
              </Typography>
              <Box>
                {exam.categories?.map((cat) => (
                  <Chip key={cat} label={cat} color="secondary" size="small" sx={{ mr: 0.5 }} />
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={exam.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
              </Box>
              <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                题目数量: {exam.questions.length}
                {exam.time_limit && ` | 时间限制: ${exam.time_limit}秒`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => {
                    navigate(`/exams/${exam.id}`);
                  }}
                  variant="contained"
                  size="small"
                >
                  查看详情
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/exams/${exam.id}/play`);
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
      </Grid>
    </>
  );
}
