import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import QuestionFilter from '@/components/QuestionFilter';
import { mockQuestionData } from '@/util/mock';
import QuestionTable from './QuestionTable';
// import { useGetQuestions } from '@/api/genshinQuizAPI';

export default function QuestionListPage() {
  // const { data: questions, isLoading, error } = useGetQuestions();
  // const questionList = questions?.questions || [];
  const questionList = mockQuestionData;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    'default' | 'difficulty' | 'category' | 'answerCount' | 'correctRate'
  >('default');
  const [sortAsc, setSortAsc] = useState(true);

  // 排序和过滤
  let filteredQuestions = questionList.filter(
    (question) =>
      (selectedCategory === '' || question.category === selectedCategory) &&
      (selectedQuestionTypes.length === 0 ||
        selectedQuestionTypes.includes(question.question_type)) &&
      (selectedLanguages.length === 0 ||
        selectedLanguages.some((lang) => question.languages.includes(lang))) &&
      (search ? question.question_text.includes(search) : true) &&
      (difficulty ? question.difficulty === difficulty : true),
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
    <Box
      sx={{
        width: '100%',
        maxWidth: 900,
        minWidth: 0,
        mx: 'auto',
        py: 4,
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          题目列表
        </Typography>
        <Typography variant="subtitle1">浏览所有题目，点击查看详情并开始答题！</Typography>
      </Box>

      {/* 筛选区 */}
      <QuestionFilter
        questionList={questionList}
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
      />

      {/* 题目表格 */}
      <QuestionTable questions={filteredQuestions} />
    </Box>
  );
}
