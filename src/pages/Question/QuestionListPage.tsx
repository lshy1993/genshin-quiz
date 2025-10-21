import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GetQuestionsParams } from '@/api/dto';
import { useGetQuestions } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import QuestionFilter from '@/components/Question/QuestionFilter';
import QuestionTable from '@/components/Question/QuestionTable';
import { useUser } from '@/context/UserContext';

export default function QuestionListPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [searchParams, setSearchParams] = useState<GetQuestionsParams>({
    page: 1,
    limit: 25,
    // category: '',
    // difficulty: '',
    query: '',
    language: [],
    sortBy: '',
    sortDesc: false,
  });
  const { data: questions, isLoading, error } = useGetQuestions(searchParams);
  const questionList = questions?.questions || [];

  // const [search, setSearch] = useState('');
  // const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string>('');
  // const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  // const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  // const [sortBy, setSortBy] = useState<QuestionSortType>(QuestionSortType.DEFAULT);
  // const [sortAsc, setSortAsc] = useState<boolean>(true);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    return <Alert severity="error">{`加载题目出错: ${error.message}`}</Alert>;
  }

  return (
    <PageContainer>
      <BannerBox title={'题目列表'} subtitle={'浏览所有题目，点击查看详情并开始答题！'} />
      {user && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/questions/create')}
          >
            创建题目
          </Button>
        </Box>
      )}
      <QuestionFilter params={searchParams} setSearchParams={setSearchParams} />
      <QuestionTable questions={questionList} />
    </PageContainer>
  );
}
