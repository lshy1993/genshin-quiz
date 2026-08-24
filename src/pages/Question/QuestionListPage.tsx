import { Alert, CircularProgress } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import type { GetQuestionsParams } from '@/api/dto';
import { useGetQuestions } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import FloatingAddButton from '@/components/Button/FloatingAddButton';
import PageContainer from '@/components/PageContainer';
import QuestionFilter from '@/components/Question/QuestionFilter';
import QuestionTable from '@/components/Question/QuestionTable';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function QuestionListPage() {
  const { user } = useUser();
  const { currentLanguage } = useLanguage();

  const [searchParams, setSearchParams] = useState<GetQuestionsParams>({
    page: 1,
    limit: 25,
    // category: '',
    // difficulty: '',
    query: '',
    language: [currentLanguage],
    sortBy: '',
    sortDesc: false,
  });

  // 监听语言变化，自动更新搜索参数
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      language: [currentLanguage],
      page: 1, // 重置到第一页
    }));
  }, [currentLanguage]);

  const { data: questions, isLoading, error } = useGetQuestions(searchParams);
  const questionList = questions?.questions || [];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    return (
      <Alert severity="error">{t('question_list.load_failed', { message: error.message })}</Alert>
    );
  }

  return (
    <PageContainer>
      <BannerBox title={t('question_list.title')} subtitle={t('question_list.subtitle')} />
      <QuestionFilter params={searchParams} setSearchParams={setSearchParams} />
      <QuestionTable questions={questionList} />
      {user && (
        <FloatingAddButton to="/questions/create" label={t('common.btn_label.create_question')} />
      )}
    </PageContainer>
  );
}
