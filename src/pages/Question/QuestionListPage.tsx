import { Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import type { GetQuestionsParams } from '@/api/dto';
import { useGetQuestions } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import QuestionFilter from '@/components/Question/QuestionFilter';
import QuestionTable from '@/components/Question/QuestionTable';

export default function QuestionListPage() {
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
      <QuestionFilter params={searchParams} setSearchParams={setSearchParams} />
      <QuestionTable questions={questionList} />
    </PageContainer>
  );
}
