import { Box, Typography, Paper, Chip, Tooltip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import KeysModule from '../components/KeysModule';
import CompanyManager from '../components/CompanyManager';
import { useTranslations } from '../contexts/TranslationContext';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslations();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const parseStatus = (status) => {
        const statuses = {
            'enabled_active': {
                name: t('dashboard.status.enabled_active.name'),
                color: 'light',
                help: t('dashboard.status.enabled_active.help'),
            },
            'enabled_inactive': {
                name: t('dashboard.status.enabled_inactive.name'),
                color: 'warning',
                help: t('dashboard.status.enabled_inactive.help'),
            },
            'disabled_inactive': {
                name: t('dashboard.status.disabled_inactive.name'),
                color: 'error',
                help: t('dashboard.status.disabled_inactive.help'),
            },
        }

        return statuses[status];
    }

    return (
        <Box sx={{ mt: 4, px: 2 }}>
            {user ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        {t('dashboard.title')}
                    </Typography>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
                        <Typography variant="h6">{t('dashboard.welcome', { name: user.name })}</Typography>
                        <Chip color="secondary" label={t('dashboard.balance', { balance: Number(user.balance).toFixed(2) })} sx={{ mr: 1 }} />
                        <Chip label={t('dashboard.role', { role: user.role })} sx={{ mr: 1 }} />
                        <Tooltip title={parseStatus(user?.status)?.help}>
                            <Chip label={t('dashboard.status_label', { status: parseStatus(user?.status)?.name })} color={parseStatus(user?.status)?.color} sx={{ mr: 1 }} />
                        </Tooltip>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('dashboard.keys_handling')}</Typography>
                        <KeysModule />
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('dashboard.company')}</Typography>
                        {user.role == "business" ? (
                            <CompanyManager />
                        ) : (
                            <Typography variant="body1" gutterBottom>
                                {t('dashboard.company_not_business')}
                            </Typography>
                        )}
                    </Paper>
                </>
            ) : (
                <Button color="inherit" component={Link} to="/login">
                    {t('dashboard.login')}
                </Button>
            )}
        </Box>
    );
}

