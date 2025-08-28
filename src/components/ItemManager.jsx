import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, useMediaQuery,
    CircularProgress,
    Stack,
    Card,
    Typography,
    Container
} from '@mui/material';
import { Add, Edit, Delete, Info } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../contexts/TranslationContext';

const defaultForm = {
    name: '', short_name: '', price: '', number: '', unit: ''
};

export default function ItemManager() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslations();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(defaultForm);
    const [editId, setEditId] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
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

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        const res = await api.get('/api/items');
        setItems(res.data);
        setIsLoading(false);
    };

    const handleOpenForm = (item = null) => {
        setErrors({});
        if (item) {
            setForm({ ...item });
            setEditId(item.id);
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
            if (itemToDelete) {
                await api.delete(`/api/items/${itemToDelete.id}`);
                await fetchItems();
            }
        } catch (err) {
            console.error('Delete failed:', err);
            showAlert(t('common.unexpected_error') + " " + err, "error");
        } finally {
            showAlert(t('items.item_deleted'), "success");
            setIsDeleting(false);
            setOpenDelete(false);
            setItemToDelete(null);
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
                await api.put(`/api/items/${editId}`, payload);
            } else {
                await api.post('/api/items', payload);
            }

            await fetchItems();
            handleCloseForm();
            setErrors({});
            showAlert(t('items.item_saved'), "success");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                showAlert(t('common.form_errors'), "warning");
            } else {
                console.error('Unexpected error:', err);
                showAlert(t('common.unexpected_error') + " " + err, "error");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDetails = (item) => {
        setSelectedItem(item);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setSelectedItem(null);
        setOpenDetails(false);
    };

    return (
        <Container maxWidth="md">
            <Box p={2} sx={{ maxWidth: 900 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                        {t('items.add_item')}
                    </Button>
                </Box>
                <Container>
                    {isLoading ?
                        <>
                            <CircularProgress size={40} />
                        </> :
                        <></>}
                </Container>
                <Stack spacing={2}>
                    {items.map(item => (
                        <Card key={item.id} sx={{ p: 2 }}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                justifyContent="space-between"
                                spacing={1}
                            >
                                {/* Name + Status */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        PSU {item.price}
                                    </Typography>
                                </Stack>

                                {/* Actions */}
                                <Stack direction="row" spacing={1}>
                                    <IconButton onClick={() => handleOpenForm(item)}><Edit /></IconButton>
                                    <IconButton onClick={() => {
                                        setItemToDelete(item);
                                        setOpenDelete(true);
                                    }}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDetails(item)}><Info /></IconButton>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </Stack>

                {/* Unified Create/Edit Modal */}
                <Dialog open={openForm} onClose={handleCloseForm} fullScreen={fullScreen}>
                    <DialogTitle>{editId ? t('items.edit_item') : t('items.add_item')}</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }} className='itemForm'>
                        <TextField required label={t('items.name')} error={!!errors.name} helperText={errors.name?.[0]} name="name" value={form.name} onChange={handleChange} fullWidth variant="standard" />
                        <TextField required label={t('items.short_name')} error={!!errors.short_name} helperText={errors.short_name?.[0]} name="short_name" value={form.short_name} onChange={handleChange} fullWidth variant="standard" />
                        <TextField required label={t('items.price')} error={!!errors.price} helperText={errors.price?.[0]} name="price" type="number" value={form.price} onChange={handleChange} fullWidth variant="standard" />
                        <TextField required label={t('items.number')} error={!!errors.number} helperText={errors.number?.[0]} name="number" type="number" value={form.number} onChange={handleChange} fullWidth variant="standard" />
                        <TextField required label={t('items.unit')} error={!!errors.unit} helperText={errors.unit?.[0]} name="unit" value={form.unit} onChange={handleChange} fullWidth variant="standard" />
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

                {/* Read-Only Details Modal */}
                <Dialog open={openDetails} onClose={handleCloseDetails} fullScreen={fullScreen}>
                    <DialogTitle>{t('items.item_details')}</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 350 }}>
                        <TextField label={t('items.name')} value={selectedItem?.name || ''} fullWidth variant="standard" />
                        <TextField label={t('items.short_name')} value={selectedItem?.short_name || ''} fullWidth variant="standard" />
                        <TextField label={t('items.price')} value={selectedItem?.price || ''} fullWidth variant="standard" />
                        <TextField label={t('items.number')} value={selectedItem?.number || ''} fullWidth variant="standard" />
                        <TextField label={t('items.unit')} value={selectedItem?.unit || ''} fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetails} color="info">{t('common.close')}</Button>
                    </DialogActions>
                </Dialog>

                {/* Confirm delete dialog */}
                <ConfirmDeleteDialog
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    title={t('items.delete_item')}
                    description={t('items.delete_item_confirm') + " " + itemToDelete?.name + "?" }
                />
            </Box>
        </Container>
    );
}
