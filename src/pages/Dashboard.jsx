import { Box, Typography, Paper, Chip, Tooltip, ClickAwayListener } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import KeysModule from '../components/KeysModule';
import CompanyManager from '../components/CompanyManager';
import { useTranslations } from '../contexts/TranslationContext';
import { useState } from 'react';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [open, setOpen] = useState({
        status: false,
        card_number: false,
        account_number: false,
    });

    const handleTooltipClose = (id) => {
        setOpen({ ...open, [id]: false });
    };

    const handleTooltipOpen = (id) => {
        setOpen({ ...open, [id]: true });
    };

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
                        <ClickAwayListener onClickAway={() => handleTooltipClose('status')}>
                            <Tooltip
                                onClose={() => handleTooltipClose('status')}
                                open={open.status}
                                title={parseStatus(user?.status)?.help}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                slotProps={{
                                    popper: {
                                        disablePortal: true,
                                    },
                                }}
                            >
                                <Chip sx={{ mr: 1 }} onClick={() => handleTooltipOpen('status')} label={t('dashboard.status_label', { status: parseStatus(user?.status)?.name })} color={parseStatus(user?.status)?.color} />
                            </Tooltip>
                        </ClickAwayListener>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3  }}>
                        <ClickAwayListener onClickAway={() => handleTooltipClose('card_number')}>
                            <Tooltip
                                onClose={() => handleTooltipClose('card_number')}
                                open={open.card_number}
                                title={t('dashboard.card_number_help')}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                slotProps={{
                                    popper: {
                                        disablePortal: true,
                                    },
                                }}
                            >
                                <Chip onClick={() => handleTooltipOpen('card_number')} label={t('dashboard.card_number', { card_number: user.card_number ?? "N/A" })} sx={{ mr: 1 }} />
                            </Tooltip>
                        </ClickAwayListener>

                        <ClickAwayListener onClickAway={() => handleTooltipClose('account_number')}>
                            <Tooltip
                                onClose={() => handleTooltipClose('account_number')}
                                open={open.account_number}
                                title={t('dashboard.account_number_help')}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                slotProps={{
                                    popper: {
                                        disablePortal: true,
                                    },
                                }}
                            >
                                <Chip onClick={() => handleTooltipOpen('account_number')} label={t('dashboard.account_number', { account_number: user.account_number ?? "N/A" })} sx={{ mr: 1 }} />
                            </Tooltip>
                        </ClickAwayListener>
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

