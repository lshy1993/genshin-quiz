import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { Button, ButtonGroup } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

interface LikeButtonsProps {
  likes: number;
  likeStatus?: 1 | 0 | -1;
  onLike: (likeStatus: 1 | 0 | -1) => void;
}

export default function LikeButtons({ likes, likeStatus, onLike }: LikeButtonsProps) {
  return (
    <ButtonGroup size="small" sx={{ height: 32 }}>
      <Button
        size="small"
        color="inherit"
        variant="text"
        startIcon={<ThumbUpAltOutlinedIcon fontSize="small" />}
        onClick={() => onLike(likeStatus === 1 ? 0 : 1)}
        sx={{
          px: 1.5,
          bgcolor: likeStatus === 1 ? 'primary.main' : undefined,
          color: likeStatus === 1 ? '#fff' : undefined,
          '&:hover': {
            bgcolor: likeStatus === 1 ? 'primary.dark' : 'action.hover',
          },
        }}
      >
        {formatNumberShort(likes)}
      </Button>
      <Button
        size="small"
        color="inherit"
        variant="text"
        onClick={() => onLike(likeStatus === -1 ? 0 : -1)}
        sx={{
          px: 1.5,
          bgcolor: likeStatus === -1 ? 'grey.700' : undefined,
          color: likeStatus === -1 ? '#fff' : undefined,
          '&:hover': {
            bgcolor: likeStatus === -1 ? 'grey.800' : 'action.hover',
          },
        }}
      >
        <ThumbDownAltOutlinedIcon fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}
