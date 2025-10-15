import { useState } from 'react';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import QuestionFilter from '@/components/Question/QuestionFilter';
import QuestionTable from '@/components/Question/QuestionTable';
import { QuestionSortType } from '@/util/enum';
import { mockQuestionData } from '@/util/mock';
// import { useGetQuestions } from '@/api/genshinQuizAPI';

export default function QuestionListPage() {
  // const { data: questions, isLoading, error } = useGetQuestions();
  // const questionList = questions?.questions || [];
  const questionList = mockQuestionData;

  const [search, setSearch] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<QuestionSortType>(QuestionSortType.DEFAULT);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 排序和过滤
  let filteredQuestions = questionList.filter(
    (question) =>
      (selectedCategory === '' || question.category === selectedCategory) &&
      (selectedQuestionTypes.length === 0 ||
        selectedQuestionTypes.includes(question.question_type)) &&
      (selectedLanguages.length === 0 ||
        selectedLanguages.some((lang) => question.languages.includes(lang))) &&
      (search ? question.question_text.includes(search) : true) &&
      (selectedDifficulties.length > 0 ? selectedDifficulties.includes(question.difficulty) : true),
  );

  if (sortBy !== 'default') {
    filteredQuestions = [...filteredQuestions].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'difficulty') {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        cmp =
          (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) -
          (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
      }
      if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      if (sortBy === 'answerCount') {
        // 没有答题数据的题目排在最后
        const aCount = a?.answer_count ?? 0;
        const bCount = b?.answer_count ?? 0;
        if (aCount === 0 && bCount === 0) cmp = 0;
        else if (aCount === 0) cmp = 1;
        else if (bCount === 0) cmp = -1;
        else cmp = aCount - bCount;
      }
      if (sortBy === 'correctRate') {
        const aCount = a?.answer_count ?? 0;
        const bCount = b?.answer_count ?? 0;
        // 没有答题数据的题目排在最后
        if (aCount === 0 && bCount === 0) cmp = 0;
        else if (aCount === 0) cmp = 1;
        else if (bCount === 0) cmp = -1;
        else {
          const correctRateA = (a?.correct_count || 0) / aCount;
          const correctRateB = (b?.correct_count || 0) / bCount;
          cmp = correctRateA - correctRateB;
        }
      }
      return sortAsc ? cmp : -cmp;
    });
  }

  return (
    <PageContainer>
      <BannerBox title={'题目列表'} subtitle={'浏览所有题目，点击查看详情并开始答题！'} />
      <QuestionFilter
        search={search}
        setSearch={setSearch}
        selectedDifficulties={selectedDifficulties}
        setSelectedDifficulties={setSelectedDifficulties}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />
      <QuestionTable questions={filteredQuestions} />
    </PageContainer>
  );
}
