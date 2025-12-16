import ShuffleIcon from '@mui/icons-material/Shuffle';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
  tooltip?: string;
  onClick: () => void;
}

export default function RandomButton({ tooltip, onClick }: Props) {
  const button = (
    <IconButton onClick={onClick}>
      <ShuffleIcon />
    </IconButton>
  );

  return tooltip ? (
    <Tooltip title={tooltip} placement="left">
      {button}
    </Tooltip>
  ) : (
    button
  );
}
