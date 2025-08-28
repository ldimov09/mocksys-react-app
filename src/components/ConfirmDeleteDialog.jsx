import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
  CircularProgress
} from '@mui/material';
import { useTranslations } from '../contexts/TranslationContext';

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description
}) {
  const { t } = useTranslations();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || t('common.confirm_delete')}</DialogTitle>
      <DialogContent>
        <Typography>{description || t('common.confirm_delete_description')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info" disabled={isDeleting}>
          {isDeleting ? (<CircularProgress size={20} color="inherit" />) : t('common.cancel')}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (<CircularProgress size={20} color="inherit" />) : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}