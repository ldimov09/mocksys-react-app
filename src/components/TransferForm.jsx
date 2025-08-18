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
import { useValidation } from '../contexts/ValidationContext';

export default function TransferForm() {
  const { user, login } = useAuth();
  const { showAlert } = useAlert();

  const [receiverAccount, setReceiverAccount] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverData, setReceiverData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const { validateAll, getFieldProps, errors } = useValidation();

  const handlePreview = async () => {
    const valid = validateAll(document.querySelector(".transferForm"));

    if (!valid) {
      showAlert('All fields are required', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/api/users/${receiverAccount}`);
      setReceiverData(response.data.data);
      setModalOpen(true);
    } catch (err) {
      showAlert("An error occured. " + (err.response.data.error ?? ""), 'error');
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

      console.log(response?.data?.balance);

      user.balance = response.data.balance ?? user.balance;

      login(user); // Update user context (e.g. new balance)
      showAlert('Transfer successful!', 'success');
      setModalOpen(false);
      setReceiverAccount('');
      setPin('');
      setAmount('');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Transfer failed', 'error');
    }
  };

  return (
    <Box sx={{ mt: 3 }} className="transferForm">
      <TextField
        variant="standard"
        label="Receiver Account Number"
        fullWidth
        margin="normal"
        value={receiverAccount}
        onChange={(e) => setReceiverAccount(e.target.value)}
        required
        name="account_number"
        {...getFieldProps('account_number')}
      />
      <TextField
        variant="standard"
        label="Amount"
        fullWidth
        type="number"
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        name="amount"
        {...getFieldProps('amount')}
      />
      <TextField
        variant="standard"
        label="Your PIN"
        fullWidth
        type="password"
        margin="normal"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        required
        name="pin"
        {...getFieldProps('pin')}
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
              <Typography><strong>Amount:</strong> PSU {Number(amount).toFixed(2)}</Typography>
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
