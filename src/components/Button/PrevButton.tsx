import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
  tooltip?: string;
  onClick: () => void;
}

export default function PrevButton({ tooltip, onClick }: Props) {
  const button = (
    <IconButton onClick={onClick}>
      <ArrowBackIcon />
    </IconButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
}
