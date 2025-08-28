import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useTranslations } from "../contexts/TranslationContext";

export default function DeviceKeyQRModal({ deviceKey }) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslations();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <IconButton onClick={() => handleOpen()}>
                <QrCode2Icon />
            </IconButton>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>{t('devices.device_key_qr')}</DialogTitle>
                <DialogContent>
                    {deviceKey ? (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={1}>
                            <QRCodeCanvas value={deviceKey} size={200} />
                            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {deviceKey}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography color="error">{t('devices.no_device_key_found')}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        {t('common.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
