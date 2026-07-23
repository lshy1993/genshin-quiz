import { Add as AddIcon } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FloatingAddButtonProps {
  to: string;
  label: string;
}

export default function FloatingAddButton({ to, label }: FloatingAddButtonProps) {
  const navigate = useNavigate();

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add"
      onClick={() => navigate(to)}
      sx={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <AddIcon sx={{ mr: 1 }} />
      {label}
    </Fab>
  );
}
