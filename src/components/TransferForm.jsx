import { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';

export default function TransferForm() {
  const { user, login } = useAuth();
  const { showAlert } = useAlert();

  const [receiverAccount, setReceiverAccount] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverData, setReceiverData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    if (!receiverAccount || !pin || !amount) {
      showAlert('All fields are required', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/users/${receiverAccount}`);
      setReceiverData(response.data.data);
      setModalOpen(true);
    } catch (err) {
      showAlert("An error occured. " + (err.response.data.data ?? ""), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    try {
      const payload = {
        receiver_account: receiverAccount,
        pin,
        amount: parseFloat(amount),
      };

      const response = await api.post('/api/transfer', payload);

      user.balance = response.data.balance ?? user.balance;

      login(user); // Update user context (e.g. new balance)
      showAlert('Transfer successful!', 'success');
      setModalOpen(false);
      setReceiverAccount('');
      setPin('');
      setAmount('');
    } catch (err) {
      showAlert(err.response?.data?.data || 'Transfer failed', 'error');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TextField
        label="Receiver Account Number"
        fullWidth
        margin="normal"
        value={receiverAccount}
        onChange={(e) => setReceiverAccount(e.target.value)}
      />
      <TextField
        label="Amount"
        fullWidth
        type="number"
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        label="Your PIN"
        fullWidth
        type="password"
        margin="normal"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handlePreview}
        disabled={loading}
      >
        Preview Transfer
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Confirm Transfer</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          {receiverData && (
            <>
              <Typography><strong>To:</strong> {receiverData.name}</Typography>
              <Typography><strong>Account:</strong> {receiverData.account_number}</Typography>
              <Typography><strong>Amount:</strong> Ʉ{Number(amount).toFixed(2)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmTransfer} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
