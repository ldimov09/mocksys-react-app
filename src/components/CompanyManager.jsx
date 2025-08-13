import React, { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Typography, CircularProgress
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';

const LEGAL_FORMS = {
    'ad': 'PLC',
    'ead': 'Sole PLC',
    'eood': 'Ltd (Sole)',
    'et': 'Sole Trader',
    'ood': 'Ltd'
};

const defaultForm = {
    manager_name: '',
    name: '',
    address: '',
    legal_form: ''
};

export default function CompanyManager() {
    const { showAlert } = useAlert();
    const { user, login } = useAuth();
    const [form, setForm] = useState(defaultForm);
    const [company, setCompany] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    

    const fetchCompany = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/company');
            setCompany(res.data);
            setForm({
                manager_name: res.data.manager_name || '',
                name: res.data.name || '',
                address: res.data.address || '',
                legal_form: res.data.legal_form || ''
            });
        } catch (err) {
            setCompany(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (company) {
                const res = await api.put('/api/company', form);
                setCompany(res.data);
            } else {
                const res = await api.post('/api/company', form);
                setCompany(res.data);
            }
            // Refresh user info
            const response = await api.get(`/api/users/${user.account_number}`);
            
            login(response?.data?.data);
            setOpen(false);
            setErrors({});
            showAlert("Compnay saved succesfully!", "success");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                showAlert("There are errors in your form.", "warning");
            } else {
                console.error('Unexpected error:', err);
                showAlert("Unexpected error occured " + err, "error");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!company) return;
        setSaving(true);
        try {
            await api.delete('/api/company');
            setCompany(null);
            setForm(defaultForm);
            const response = await api.get(`/api/users/${user.account_number}`);
            login(response?.data?.data);
            setOpen(false);
            showAlert("Compnay deleted succesfully!", "success");
        } catch (err) {
            console.error(err);
            showAlert("An error occured", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            {loading ? (
                <CircularProgress size={24} />
            ) : company ? (
                <Box>
                    <Typography><strong>Name:</strong> {company.name}</Typography>
                    <Typography><strong>Manager:</strong> {company.manager_name}</Typography>
                    <Typography><strong>Number:</strong> {company.number}</Typography>
                    <Typography><strong>Address:</strong> {company.address}</Typography>
                    <Typography><strong>Legal Form:</strong> {LEGAL_FORMS[company.legal_form]}</Typography>
                    <Box mt={2}>
                        <Button variant="outlined" onClick={() => setOpen(true)}>Edit Company</Button>
                        <Button variant="outlined" color="error" onClick={handleDelete} sx={{ ml: 1 }}>
                            {saving ? <CircularProgress size={20} color='inherit' /> : 'Delete Company'}
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Button variant="contained" onClick={() => {
                    setErrors({}); 
                    setOpen(true)}
                }>Create Company</Button>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{company ? 'Edit Company' : 'Create Company'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Manager Name"
                        name="manager_name"
                        value={form.manager_name}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        error={!!errors.manager_name} 
                        helperText={errors.manager_name?.[0]}
                    />
                    <TextField
                        label="Company Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        error={!!errors.name} 
                        helperText={errors.name?.[0]}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        error={!!errors.address} 
                        helperText={errors.address?.[0]}
                    />
                    <TextField
                        label="Legal Form"
                        name="legal_form"
                        value={form.legal_form}
                        onChange={handleChange}
                        select
                        fullWidth
                        variant="standard"
                        error={!!errors.legal_form} 
                        helperText={errors.legal_form?.[0]}
                    >
                        {Object.entries(LEGAL_FORMS).map(([key, label]) => (
                            <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color='info'>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}>
                        {saving ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
