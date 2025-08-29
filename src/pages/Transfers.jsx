import { Box, Button, Card, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import TransferForm from "../components/TransferForm";
import { use, useEffect, useState } from "react";
import api from "../services/api";
import { Info } from "@mui/icons-material";
import { useTranslations } from "../contexts/TranslationContext";

export default function Transfers() {
    const [transfers, setTransfers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState(0);

    const { t } = useTranslations();

    const handleChange = (event, newValue) => setTab(newValue);
    const openModal = (transfer) => setSelected(transfer);
    const closeModal = () => setSelected(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        const res = await api.get('/api/transfers');
        setTransfers(res?.data?.data ?? { asReceiver: [], asSender: [] });
        setIsLoading(false);
    };

    const TYPES = {
        "card_payment": t('transfers.types.card_payment'),
        "transfer": t('transfers.types.transfer'),
    };

    return (
        <>
            <Container sx={{ maxWidth: 500 }}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 500, m: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('transfers.title')}
                    </Typography>
                    <TransferForm />
                </Paper>
                <Container>
                    {isLoading && <CircularProgress size={40} />}
                </Container>

                {!isLoading && (
                    <Container sx={{ m: 0 }}>
                        <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }} scrollButtons="auto" variant="scrollable">
                            <Tab label={t('transfers.as_receiver')} />
                            <Tab label={t('transfers.as_sender')} />
                        </Tabs>

                        {/* Receiver tab */}
                        {tab === 0 && (
                            <Box>
                                <Stack spacing={2}>
                                    {transfers?.asReceiver?.length ? (
                                        transfers.asReceiver.map((transfer) => (
                                            <Card sx={{ p: 2 }} key={transfer.id}>
                                                <Stack
                                                    direction={{ xs: "column", sm: "row" }}
                                                    alignItems={{ xs: "flex-start", sm: "center" }}
                                                    justifyContent="space-between"
                                                    spacing={1}
                                                >
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {TYPES[transfer.type] ?? t('transfers.types.other')}
                                                        </Typography>
                                                        <Typography variant="body1" color="primary">
                                                            +{transfer.amount} PSU
                                                        </Typography>
                                                        <Chip sx={{ ml: 1 }} label={t(`transfers.status.${transfer.status}`)} color={transfer.status === 'approved' ? 'primary' : transfer.status === 'pending' ? 'info' : transfer.status === 'refunded' ? 'warning' : 'error'} size="small" />
                                                        <IconButton onClick={() => openModal(transfer)}><Info /></IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Card>
                                        ))
                                    ) : (
                                        <Typography variant="h6" gutterBottom>
                                            {t('transfers.no_received')}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {/* Sender tab */}
                        {tab === 1 && (
                            <Box>
                                <Stack spacing={2}>
                                    {transfers?.asSender?.length ? (
                                        transfers.asSender.map((transfer) => (
                                            <Card sx={{ p: 2 }} key={transfer.id}>
                                                <Stack
                                                    direction={{ xs: "column", sm: "row" }}
                                                    alignItems={{ xs: "flex-start", sm: "center" }}
                                                    justifyContent="space-between"
                                                    spacing={1}
                                                >
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {TYPES[transfer.type] ?? t('transfers.types.other')}
                                                        </Typography>
                                                        <Typography variant="body1" color="error">
                                                            -{transfer.amount} PSU
                                                        </Typography>
                                                        <Chip sx={{ ml: 1 }} label={t(`transfers.status.${transfer.status}`)} color={transfer.status === 'approved' ? 'primary' : transfer.status === 'pending' ? 'info' : transfer.status === 'refunded' ? 'warning' : 'error'} size="small" />
                                                        <IconButton onClick={() => openModal(transfer)}><Info /></IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Card>
                                        ))
                                    ) : (
                                        <Typography variant="h6" gutterBottom>
                                            {t('transfers.no_sent')}
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Container>
                )}
            </Container>

            {/* Modal for transfer details */}
            <Dialog open={!!selected} onClose={closeModal} maxWidth="sm" fullWidth>
                {selected && (
                    <>
                        <DialogTitle>{t('transfers.modal.title')}</DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={2}>
                                <Typography><strong>{t('transfers.modal.type')}:</strong> {TYPES[selected.type] ?? t('transfers.types.other')}</Typography>
                                <Typography><strong>{t('transfers.modal.amount')}:</strong> {selected.amount} PSU</Typography>
                                <Typography><strong>{t('transfers.modal.status')}:</strong></Typography>
                                <Chip sx={{ ml: 1 }} label={t(`transfers.status.${selected.status}`)} color={selected.status === 'approved' ? 'primary' : selected.status === 'pending' ? 'info' : selected.status === 'refunded' ? 'warning' : 'error'} size="small" />
                                <Typography><strong>{t('transfers.modal.created_at')}:</strong> {new Date(selected.created_at).toLocaleString()}</Typography>
                                {selected.error && <Typography color="error"><strong>{t('transfers.modal.error')}:</strong> {selected.error}</Typography>}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeModal} variant="contained">{t('transfers.modal.close')}</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}