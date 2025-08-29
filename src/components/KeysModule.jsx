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
import { useTranslations } from '../contexts/TranslationContext'; // assuming you have this
import api from '../services/api';

export default function KeysModule() {
  const { user, login } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslations();
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

      login(user);
      showAlert(
        t('keys.key_updated', { type: t(`keys.${type}_key`) }),
        'success'
      );
    } catch (err) {
      showAlert(err.response?.data?.error || t('keys.error_generic'), 'error');
    } finally {
      setLoadingKey(null);
    }
  };

  const renderKeyCard = (type) => {
    const isFiscal = type === 'fiscal';
    const key = isFiscal ? user.fiscal_key : user.transaction_key;
    const enabled = isFiscal ? user.fiscal_key_enabled : user.transaction_key_enabled;
    const label = isFiscal ? t('keys.fiscal_key') : t('keys.transaction_key');

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
            {key || t('keys.not_generated')}
          </Typography>
          <Chip
            label={enabled ? t('keys.enabled') : t('keys.disabled')}
            color={enabled ? 'success' : 'error'}
            variant="outlined"
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => handleKeyAction(type, 'reset')}
            disabled={loadingKey === type}
          >
            {loadingKey === type ? <CircularProgress size={20} /> : t('keys.generate_new')}
          </Button>
          <Button
            size="small"
            onClick={() => handleKeyAction(type, 'toggle')}
            disabled={loadingKey === type}
          >
            {loadingKey === type
              ? <CircularProgress size={20} />
              : (enabled ? t('keys.disable') : t('keys.enable'))}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item>{renderKeyCard('transaction')}</Grid>
        {user.role === "business" && (
          <Grid item>{renderKeyCard('fiscal')}</Grid>
        )}
      </Grid>
    </Box>
  );
}