import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button } from '@mui/material';
import { formatNumberShort } from '@/util/utils';

interface CommentButtonProps {
  count: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function CommentButton({ count, onClick, disabled = true }: CommentButtonProps) {
  return (
    <Button
      size="small"
      color="primary"
      variant="text"
      startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
      onClick={onClick}
      disabled={disabled}
    >
      {formatNumberShort(count)}
    </Button>
  );
}
