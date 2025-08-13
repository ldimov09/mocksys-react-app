import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
  CircularProgress
} from '@mui/material';

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title = 'Confirm Delete',
  description = 'Are you sure you want to delete this item? This action cannot be undone.'
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info" disabled={isDeleting}>
          {isDeleting ? ( <CircularProgress size={20} color="inherit" /> ) : "Cancel"}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? ( <CircularProgress size={20} color="inherit" /> ) : "Delete"}
          </Button>
      </DialogActions>
    </Dialog>
  );
}
