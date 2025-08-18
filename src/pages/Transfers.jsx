import { Box, Button, Card, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import TransferForm from "../components/TransferForm";
import { use, useEffect, useState } from "react";
import api from "../services/api";
import { Info } from "@mui/icons-material";

const TYPES = {
    "card_payment": "Card Payment",
    "transfer": "Transfer",
}

export default function Transfers() {
    const [transfers, setTransfers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState(0);

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

    return (
        <>
            <Container sx={{ maxWidth: 500 }}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 500, m: 3 }}>
                    <Typography variant="h6" gutterBottom>Transfer to another account</Typography>
                    <TransferForm />
                </Paper>
                <Container>
                    {isLoading ?
                        <>
                            <CircularProgress size={40} />
                        </> :
                        <></>}
                </Container>
                {!isLoading ? (
                    <>
                        <Container sx={{ m: 0 }}>
                            <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
                                <Tab label="As receiver - last 30 days" />
                                <Tab label="As sender - last 30 days" />
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
                                                                {TYPES[transfer.type] ?? "Other Payment"}
                                                            </Typography>
                                                            <Typography variant="body1" color="primary">
                                                                +{transfer.amount} PSU
                                                            </Typography>
                                                            {transfer.status === "approved" ? (
                                                                <Chip sx={{ml: 1}} label="Approved" color="primary" size="small" />
                                                            ) : transfer.status === "pending" ? (
                                                                <Chip sx={{ml: 1}} label="Pending" color="info" size="small" />
                                                            ) : transfer.status === "refunded" ? (
                                                                <Chip sx={{ml: 1}} label="Refunded" color="warning" size="small" />
                                                            ) : (
                                                                <Chip sx={{ml: 1}} label="Declined" color="error" size="small" />
                                                            )}
                                                            <IconButton onClick={() => openModal(transfer)}><Info /></IconButton>
                                                        </Stack>
                                                    </Stack>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography variant="h6" gutterBottom>
                                                No received transfers
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
                                                                {TYPES[transfer.type] ?? "Other Payment"}
                                                            </Typography>
                                                            <Typography variant="body1" color="error">
                                                                -{transfer.amount} PSU
                                                            </Typography>
                                                            {transfer.status === "approved" ? (
                                                                <Chip sx={{ml: 1}} label="Approved" color="primary" size="small" />
                                                            ) : transfer.status === "pending" ? (
                                                                <Chip sx={{ml: 1}} label="Pending" color="info" size="small" />
                                                            ) : transfer.status === "refunded" ? (
                                                                <Chip sx={{ml: 1}} label="Refunded" color="warning" size="small" />
                                                            ) : (
                                                                <Chip sx={{ml: 1}} label="Declined" color="error" size="small" />
                                                            )}
                                                            <IconButton onClick={() => openModal(transfer)}><Info /></IconButton>
                                                        </Stack>
                                                    </Stack>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography variant="h6" gutterBottom>
                                                No sent transfers
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            )}
                        </Container>
                    </>
                ) : (<></>)}
            </Container>
            {/* Modal for transfer details */}
            <Dialog open={!!selected} onClose={closeModal} maxWidth="sm" fullWidth>
                {selected && (
                    <>
                        <DialogTitle>Transfer Details</DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={2}>
                                <Typography>
                                    <strong>Type:</strong>  {TYPES[selected.type] ?? "Other Payment"}
                                </Typography>
                                <Typography>
                                    <strong>Amount:</strong> {selected.amount} PSU
                                </Typography>
                                <Typography>
                                    <strong>Status:</strong>
                                    {selected.status === "approved" ? (
                                        <Chip sx={{ml: 1}} label="Approved" color="primary" size="small" />
                                    ) : selected.status === "pending" ? (
                                        <Chip sx={{ml: 1}} label="Pending" color="info" size="small" />
                                    ) : selected.status === "refunded" ? (
                                        <Chip sx={{ml: 1}} label="Refunded" color="warning" size="small" />
                                    ) : (
                                        <Chip sx={{ml: 1}} label="Declined" color="error" size="small" />
                                    )}
                                </Typography>


                                <Typography>
                                    <strong>Created at:</strong>{" "}
                                    {new Date(selected.created_at).toLocaleString()}
                                </Typography>
                                {selected.error && (
                                    <Typography color="error">
                                        <strong>Error:</strong> {selected.error}
                                    </Typography>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeModal} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}