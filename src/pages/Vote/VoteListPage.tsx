import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type GetVotesParams, GetVotesType } from '@/api/dto';
import { useGetVotes } from '@/api/genshinQuizAPI';
import BannerBox from '@/components/BannerBox';
import PageContainer from '@/components/PageContainer';
import VoteFilter from '@/components/Vote/VoteFilter';
import VoteTable from '@/components/Vote/VoteTable';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { mockVotes } from '@/util/mock';

export default function VoteListPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { currentLanguage } = useLanguage();

  const [searchParams, setSearchParams] = useState<GetVotesParams>({
    page: 1,
    limit: 25,
    query: '',
    language: [currentLanguage],
    type: GetVotesType.available,
    sortBy: '',
    sortDesc: false,
  });

  const { data: votes, isLoading, error } = useGetVotes(searchParams);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error || !votes) {
    console.error(error);
    return <Alert severity="error">加载投票出错</Alert>;
  }

  const voteList = votes?.votes || mockVotes;

  return (
    <PageContainer>
      <BannerBox title={'投票列表'} subtitle={'参与投票吧！谁是真正的人气王！'} />
      {user && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/votes/create')}
          >
            创建投票
          </Button>
        </Box>
      )}
      <VoteFilter
        search={searchParams.query || ''}
        setSearch={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            query: value,
            page: 1,
          }))
        }
        typeFilter={searchParams.type || GetVotesType.available}
        setTypeFilter={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            type: value,
            page: 1,
          }))
        }
      />
      <VoteTable votes={voteList} />
    </PageContainer>
  );
}
