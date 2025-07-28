import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ accountNumber: '', password: '' });

  const validateFields = () => {
    const errors = { accountNumber: '', password: '' };
    let isValid = true;

    if (!accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      showAlert('Please fix the errors in the form.', 'warning');
      return;
    }

    try {
      const response = await api.post('/api/login', {
        account_number: accountNumber,
        password,
      });

      login(response.data.user);
      showAlert('Login successful!', 'success');

      navigate('/');
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.error || 'Unknown error.';
      setError('Login failed.');
      showAlert('Login failed. ' + message, 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            error={Boolean(fieldErrors.accountNumber)}
            helperText={fieldErrors.accountNumber}
            variant="standard"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            variant="standard"
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}
