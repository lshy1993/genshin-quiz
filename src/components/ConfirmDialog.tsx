import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmColor?: 'error' | 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export default function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  confirmColor = 'primary',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {(description || children) && (
        <DialogContent>
          {description && <Typography>{description}</Typography>}
          {children}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button color={confirmColor} variant="contained" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
