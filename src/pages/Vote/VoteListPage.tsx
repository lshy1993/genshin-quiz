import { Alert, CircularProgress } from '@mui/material';
import { t } from 'i18next';
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
import { PATHS } from '@/route/route';

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
    return (
      <Alert severity="error">
        {t('poll_list.load_failed', { message: error?.message ?? '' })}
      </Alert>
    );
  }

  return (
    <PageContainer>
      <BannerBox title={t('poll_list.title')} subtitle={t('poll_list.subtitle')} />
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
      {user && (
        <FloatingAddButton to={PATHS.POLL_CREATE} label={t('common.btn_label.create_poll')} />
      )}
    </PageContainer>
  );
}
