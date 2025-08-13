import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, useMediaQuery,
    CircularProgress, MenuItem,
    Chip,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete, Info, CheckBox } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useAlert } from '../contexts/AlertContext';

const defaultForm = {
    name: '', address: '', number: '', device_key: '', status: 'inactive', description: ''
};

export default function DeviceManager() {
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
    const { showAlert } = useAlert();
    const [errors, setErrors] = useState({});

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => { fetchDevices(); }, []);

    const fetchDevices = async () => {
        const res = await api.get('/api/devices');
        setDevices(res.data);
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
            showAlert("Unexpected error occurred " + err, "error");
        } finally {
            showAlert("Device deleted.", "success");
            setIsDeleting(false);
            setOpenDelete(false);
            setDeviceToDelete(null);
        }
    }

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
            showAlert("Device saved.", "success");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                showAlert("There are errors in your form.", "warning");
            } else {
                console.error('Unexpected error:', err);
                showAlert("Unexpected error occurred " + err, "error");
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
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                    Add Device
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map(device => (
                            <TableRow key={device.id}>
                                <TableCell>{device.name}</TableCell>
                                <TableCell>{device.status == "disabled" ? 
                                    <>
                                        <Chip label="Disabled" color="error"/>
                                    </> : 
                                    <>
                                        <Chip label="Enabled" color="primary"/>
                                    </>
                                }</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenForm(device)}><Edit /></IconButton>
                                    <IconButton onClick={() => {
                                        setDeviceToDelete(device);
                                        setOpenDelete(true);
                                    }}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDetails(device)}><Info /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Unified Create/Edit Modal */}
            <Dialog open={openForm} onClose={handleCloseForm} fullScreen={fullScreen}>
                <DialogTitle>{editId ? 'Edit Device' : 'Add Device'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }}>
                    <TextField required label="Name" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name?.[0]} variant="standard" fullWidth />
                    <TextField required label="Address" name="address" value={form.address} onChange={handleChange} error={!!errors.address} helperText={errors.address?.[0]} variant="standard" fullWidth />
                    <TextField required label="Number" name="number" value={form.number} onChange={handleChange} error={!!errors.number} helperText={errors.number?.[0]} variant="standard" fullWidth />
                    <TextField slotProps={{ input: { readOnly: true, }}} required label="Device Key" name="device_key" value={form.device_key} onChange={handleChange} error={!!errors.device_key} helperText={errors.device_key?.[0]} variant="standard" fullWidth />
                    <TextField select label="Status" name="status" value={form.status} onChange={handleChange} variant="standard" fullWidth>
                        <MenuItem value="enabled">Enabled</MenuItem>
                        <MenuItem value="disabled">Disabled</MenuItem>
                    </TextField>
                    <TextField label="Description" name="description" value={form.description} onChange={handleChange} error={!!errors.description} helperText={errors.description?.[0]} variant="standard" fullWidth />
                    <FormControlLabel name='new_key' control={<Checkbox name="new_key" value={form.new_key} onChange={handleChange} error={!!errors.new_key} helperText={errors.new_key?.[0]}/>} label="Generate new key if editing"/>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleCloseForm} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Cancel'}
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Read-Only Details Modal */}
            <Dialog open={openDetails} onClose={handleCloseDetails} fullScreen={fullScreen}>
                <DialogTitle>Device Details</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }}>
                    <TextField label="ID" value={selectedDevice?.id || ''} fullWidth variant="standard" />
                    <TextField label="Name" value={selectedDevice?.name || ''} fullWidth variant="standard" />
                    <TextField label="Address" value={selectedDevice?.address || ''} fullWidth variant="standard" />
                    <TextField label="Number" value={selectedDevice?.number || ''} fullWidth variant="standard" />
                    <TextField label="Device Key" value={selectedDevice?.device_key || ''} fullWidth variant="standard" />
                    <TextField label="Status" value={selectedDevice?.status || ''} fullWidth variant="standard" />
                    <TextField label="Description" value={selectedDevice?.description || ''} fullWidth variant="standard" />
                    <TextField label="Last Request" value={selectedDevice?.last_seen || ''} fullWidth variant="standard" />
                    <TextField label="Last IP" value={selectedDevice?.last_ip || ''} fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} color="info">Close</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDeleteDialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Device"
                description={`Are you sure you want to delete "${deviceToDelete?.name}"?`}
            />
        </Box>
    );
}
