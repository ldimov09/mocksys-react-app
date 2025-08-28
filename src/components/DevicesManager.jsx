import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, useMediaQuery,
    CircularProgress, MenuItem,
    Chip,
    Checkbox,
    FormControlLabel,
    Stack,
    Card,
    Typography,
    Container
} from '@mui/material';
import { Add, Edit, Delete, Info, CheckBox } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useAlert } from '../contexts/AlertContext';
import DeviceKeyQRModal from './DeviceKeyQrModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../contexts/TranslationContext';

const defaultForm = {
    name: '', address: '', number: '', device_key: '', status: 'disabled', description: ''
};

export default function DeviceManager() {
    const { user } = useAuth();
    const { locale, setLocale, t } = useTranslations();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [form, setForm] = useState(defaultForm);
    const [editId, setEditId] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({});

    if (user.role != "business") {
        showAlert(t('common.no_access_page'), "warning");
        navigate("/");
    }

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => { fetchDevices(); }, []);

    const fetchDevices = async () => {
        setIsLoading(true);
        const res = await api.get('/api/devices');
        setDevices(res.data);
        setIsLoading(false);
    };

    const handleOpenForm = (device = null) => {
        setErrors({});
        if (device) {
            setForm({ ...device });
            setEditId(device.id);
        } else {
            setForm(defaultForm);
            setEditId(null);
        }
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setForm(defaultForm);
        setEditId(null);
        setOpenForm(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (deviceToDelete) {
                await api.delete(`/api/devices/${deviceToDelete.id}`);
                await fetchDevices();
            }
        } catch (err) {
            console.error('Delete failed:', err);
            showAlert(`${t('common.unexpected_error')} ${err}`, "error");
        } finally {
            showAlert(t('devices.device_deleted'), "success");
            setIsDeleting(false);
            setOpenDelete(false);
            setDeviceToDelete(null);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const payload = { ...form };

            if (editId) {
                await api.put(`/api/devices/${editId}`, payload);
            } else {
                await api.post('/api/devices', payload);
            }

            await fetchDevices();
            handleCloseForm();
            setErrors({});
            showAlert(t('devices.device_saved'), "success");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                showAlert(t('common.form_errors'), "warning");
            } else {
                console.error('Unexpected error:', err);
                showAlert(`${t('common.unexpected_error')} ${err}`, "error");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDetails = (device) => {
        setSelectedDevice(device);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setSelectedDevice(null);
        setOpenDetails(false);
    };

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                    {t('devices.add_device')}
                </Button>
            </Box>

            <Container>
                {isLoading ?
                    <CircularProgress size={40} /> :
                    <></>}
            </Container>

            <Stack spacing={2}>
                {devices.map((device) => (
                    <Card key={device.id} sx={{ p: 2 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            spacing={1}
                        >
                            {/* Name + Status */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {device.device_name}
                                </Typography>
                                {device.status === "disabled" ? (
                                    <Chip label={t('devices.disabled')} color="error" size="small" />
                                ) : (
                                    <Chip label={t('devices.enabled')} color="primary" size="small" />
                                )}
                            </Stack>

                            {/* Actions */}
                            <Stack direction="row" spacing={1}>
                                <IconButton onClick={() => handleOpenForm(device)} >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        setDeviceToDelete(device);
                                        setOpenDelete(true);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={() => handleOpenDetails(device)} >
                                    <Info />
                                </IconButton>
                                <DeviceKeyQRModal deviceKey={device.device_key} />
                            </Stack>
                        </Stack>
                    </Card>
                ))}
            </Stack>
            {/* Unified Create/Edit Modal */}
            <Dialog open={openForm} onClose={handleCloseForm} fullScreen={fullScreen}>
                <DialogTitle>{editId ? t('devices.edit_device') : t('devices.add_device')}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }}>
                    <TextField required label={t('devices.name')} name="device_name" value={form.device_name} onChange={handleChange} error={!!errors.device_name} helperText={errors.device_name?.[0]} variant="standard" fullWidth />
                    <TextField required label={t('devices.address')} name="device_address" value={form.device_address} onChange={handleChange} error={!!errors.device_address} helperText={errors.device_address?.[0]} variant="standard" fullWidth />
                    <TextField required label={t('devices.number')} name="number" value={form.number} onChange={handleChange} error={!!errors.number} helperText={errors.number?.[0]} variant="standard" fullWidth />
                    <TextField slotProps={{ input: { readOnly: true } }} required label={t('devices.device_key')} name="device_key" value={form.device_key} onChange={handleChange} error={!!errors.device_key} helperText={errors.device_key?.[0]} variant="standard" fullWidth />
                    <TextField select label={t('devices.status')} name="status" value={form.status} onChange={handleChange} variant="standard" fullWidth>
                        <MenuItem value="enabled">{t('devices.enabled')}</MenuItem>
                        <MenuItem value="disabled">{t('devices.disabled')}</MenuItem>
                    </TextField>
                    <TextField label={t('devices.description')} name="description" value={form.description} onChange={handleChange} error={!!errors.description} helperText={errors.description?.[0]} variant="standard" fullWidth />
                    <FormControlLabel name='new_key' control={<Checkbox name="new_key" value={form.new_key} onChange={handleChange} error={!!errors.new_key} helperText={errors.new_key?.[0]} />} label={t('devices.generate_new_key')} />
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleCloseForm} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : t('common.cancel')}
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : t('common.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDetails} onClose={handleCloseDetails} fullScreen={fullScreen}>
                <DialogTitle>{t('devices.device_details')}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }}>
                    <TextField label={"ID"} value={selectedDevice?.id || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.name')} value={selectedDevice?.device_name || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.address')} value={selectedDevice?.device_address || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.number')} value={selectedDevice?.number || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.device_key')} value={selectedDevice?.device_key || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.status')} value={selectedDevice?.status || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.description')} value={selectedDevice?.description || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.last_request')} value={selectedDevice?.last_seen || ''} fullWidth variant="standard" />
                    <TextField label={t('devices.last_ip')} value={selectedDevice?.last_ip || ''} fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} color="info">{t('common.close')}</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDeleteDialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title={t('devices.delete_device')}
                description={t('devices.delete_confirmation') + " " + deviceToDelete?.device_name + "?" }
            />
        </Container>
    );
}
