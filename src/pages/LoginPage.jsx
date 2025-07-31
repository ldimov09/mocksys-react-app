import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useValidation } from '../contexts/ValidationContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { validateAll, getFieldProps, errors } = useValidation();


  const validateFields = () => {
    const isValid = validateAll();
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
        user_name: userName,
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
            label="Username"
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            variant="standard"
            required
            name="username"
            {...getFieldProps('username')}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            required
            name="password"
            {...getFieldProps('password')}
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
