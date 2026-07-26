import { Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { type GetPollsParams, GetPollsType } from '@/api/dto';
import { useGetPolls } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import FloatingAddButton from '@/components/Button/FloatingAddButton';
import PageContainer from '@/components/PageContainer';
import VoteFilter from '@/components/Vote/VoteFilter';
import VoteTable from '@/components/Vote/VoteTable';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

export default function VoteListPage() {
  const { user } = useUser();
  const { currentLanguage } = useLanguage();

  const [searchParams, setSearchParams] = useState<GetPollsParams>({
    page: 1,
    limit: 25,
    query: '',
    language: [currentLanguage],
    type: GetPollsType.available,
    sortBy: '',
    sortDesc: false,
  });

  const { data: votesRes, isLoading, error } = useGetPolls(searchParams);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !votesRes) {
    console.error(error);
    return <Alert severity="error">加载投票出错</Alert>;
  }

  return (
    <PageContainer>
      <BannerBox title={'投票列表'} subtitle={'参与投票吧！谁是真正的人气王！'} />
      <VoteFilter
        search={searchParams.query || ''}
        setSearch={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            query: value,
            page: 1,
          }))
        }
        typeFilter={searchParams.type || GetPollsType.available}
        setTypeFilter={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            type: value,
            page: 1,
          }))
        }
      />
      <VoteTable votes={votesRes.polls} />
      {user && <FloatingAddButton to="/votes/create" label="创建投票" />}
    </PageContainer>
  );
}
