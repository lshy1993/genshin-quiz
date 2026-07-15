import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Box, Button, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Vote } from '@/api/dto';
import { formatNumberShort } from '@/util/utils';

interface VotePreviewCardProps {
  vote: Vote;
  language: string;
  linkTo?: string;
  actionLabel?: string;
  showDescription?: boolean;
  showStats?: boolean;
  titleVariant?: 'h6' | 'body1';
  cardVariant?: 'elevation' | 'outlined';
  fullHeight?: boolean;
}

function getLocalizedText(language: string, text?: Record<string, string>) {
  if (!text) return '';
  return text[language] || text[Object.keys(text)[0]] || '';
}

export default function VotePreviewCard({
  vote,
  language,
  linkTo,
  actionLabel,
  showDescription = true,
  showStats = false,
  titleVariant = 'h6',
  cardVariant = 'elevation',
  fullHeight = true,
}: VotePreviewCardProps) {
  const targetTo = linkTo ?? `/votes/${vote.id}`;

  return (
    <Card
      variant={cardVariant}
      sx={fullHeight ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}
    >
      <CardActionArea component={Link} to={targetTo} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant={titleVariant} component="h3" gutterBottom>
            {getLocalizedText(language, vote.title)}
          </Typography>
          {showDescription && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              {vote.description ? getLocalizedText(language, vote.description) : ''}
            </Typography>
          )}

          {showStats && (
            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <HowToVoteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatNumberShort(vote.total_votes ?? 0)} 票
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatNumberShort(vote.participants ?? 0)} 人参与
              </Typography>
            </Stack>
          )}
        </CardContent>
      </CardActionArea>

      {actionLabel && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button component={Link} to={targetTo} variant="contained" size="small" fullWidth>
            {actionLabel}
          </Button>
        </Box>
      )}
    </Card>
  );
}
