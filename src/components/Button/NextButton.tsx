import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
  tooltip?: string;
  onClick: () => void;
}

export default function NextButton({ tooltip, onClick }: Props) {
  const button = (
    <IconButton onClick={onClick}>
      <ArrowForwardIcon />
    </IconButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
}
