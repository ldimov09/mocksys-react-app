import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useValidation } from '../contexts/ValidationContext';
import { useTranslations } from '../contexts/TranslationContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { validateAll, getFieldProps, errors } = useValidation();

  const validateFields = () => {
    const isValid = validateAll(document, t);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      showAlert(t('login.fix_errors'), 'warning');
      return;
    }

    try {
      const response = await api.post('/api/login', {
        user_name: userName,
        password,
      });

      login(response.data.user);
      showAlert(t('login.success'), 'success');
      navigate('/');
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.error || t('login.unknown_error');
      setError(t('login.failed'));
      showAlert(t('login.failed') + ' ' + message, 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>{t('login.title')}</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label={t('login.username')}
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            variant="standard"
            required
            name="username"
            {...getFieldProps('username')}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label={t('login.password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            required
            name="password"
            {...getFieldProps('password')}
            error={!!errors.password}
            helperText={errors.password}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {t('login.submit')}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
