import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import QrCode2Icon from '@mui/icons-material/QrCode2';

export default function DeviceKeyQRModal({ deviceKey }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <IconButton onClick={() => handleOpen()}>
                <QrCode2Icon />
            </IconButton>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Device Key QR Code</DialogTitle>
                <DialogContent>
                    {deviceKey ? (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={1}>
                            <QRCodeCanvas value={deviceKey} size={200} includeMargin />
                            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                {deviceKey}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography color="error">No device key found</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
