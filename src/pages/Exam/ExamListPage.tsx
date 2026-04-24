import { Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import type { GetExamsParams } from '@/api/dto';
import { useGetExams } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import ExamFilter from '@/components/Exam/ExamFilter';
import ExamGrid from '@/components/Exam/ExamGrid';
import PageContainer from '@/components/PageContainer';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function ExamListPage() {
  const { user } = useUser();
  const { currentLanguage } = useLanguage();

  const [searchParams, setSearchParams] = useState<GetExamsParams>({
    page: 1,
    limit: 25,
    // category: '',
    // difficulty: '',
    query: '',
    sortBy: '',
    sortDesc: false,
  });

  const { data: examRes, isLoading, error } = useGetExams(searchParams);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    return <Alert severity="error">{`加载题目出错: ${error.message}`}</Alert>;
  }

  return (
    <PageContainer>
      <BannerBox title={'测验列表'} subtitle={'查找并参与你感兴趣的测验，提升你的知识水平！'} />
      <ExamFilter
        examList={examRes?.exams ?? []}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ExamGrid exams={examRes?.exams ?? []} />
    </PageContainer>
  );
}
