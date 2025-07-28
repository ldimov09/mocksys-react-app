import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import api from '../services/api';

export default function KeysModule() {
  const { user, login } = useAuth();
  const { showAlert } = useAlert();
  const [loadingKey, setLoadingKey] = useState(null); // 'transaction' or 'fiscal' or null

  const handleKeyAction = async (type, action) => {
    setLoadingKey(type);

    const route = `/api/keys/${type}/${action}`;

    try {
      const response = await api.post(route);
      
      user.fiscal_key = response.data.fiscal_key ?? user.fiscal_key;
      user.transaction_key = response.data.transaction_key ?? user.transaction_key;
      user.transaction_key_enabled = response.data.transaction_key_enabled ?? user.transaction_key_enabled;
      user.fiscal_key_enabled = response.data.fiscal_key_enabled ?? user.fiscal_key_enabled;

      console.log(user);

      login(user);
      showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} key updated successfully!`, 'success');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setLoadingKey(null);
    }
  };

  const renderKeyCard = (type) => {
    const isFiscal = type === 'fiscal';
    const key = isFiscal ? user.fiscal_key : user.transaction_key;
    const enabled = isFiscal ? user.fiscal_key_enabled : user.transaction_key_enabled;
    const label = isFiscal ? 'Fiscal Key' : 'Transaction Key';

    return (
      <Card variant="outlined" sx={{ minWidth: 300 }}>
        <CardContent>
          <Typography variant="h6">{label}</Typography>
          <Typography
            sx={{
              mt: 1,
              mb: 1,
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}
          >
            {key || '— Not Generated —'}
          </Typography>
          <Chip label={enabled ? 'Enabled' : 'Disabled'} color={enabled ? 'success' : 'error'} variant="outlined" />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => handleKeyAction(type, 'reset')}
            disabled={loadingKey === type}
          >
            {loadingKey === type ? <CircularProgress size={20} /> : 'Generate New'}
          </Button>
          <Button
            size="small"
            onClick={() => handleKeyAction(type, 'toggle')}
            disabled={loadingKey === type}
          >
            {loadingKey === type ? <CircularProgress size={20} /> : (enabled ? 'Disable' : 'Enable')}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item>{renderKeyCard('transaction')}</Grid>
        <Grid item>{renderKeyCard('fiscal')}</Grid>
      </Grid>
    </Box>
  );
}
