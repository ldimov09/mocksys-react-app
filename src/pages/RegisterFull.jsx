import { useState } from "react";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import { useAlert } from "../contexts/AlertContext";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../contexts/TranslationContext";

const RegisterFull = () => {
    const { t } = useTranslations();
    const { showAlert } = useAlert();
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        user_name: "",
        user_username: "",
        user_password: "",
        business_name: "",
        business_username: "",
        business_password: "",
        manager_name: "",
        company_name: "",
        address: "",
        legal_form: "",
    });

    const steps = [t('registration.user'), t('registration.business_user'), t('registration.company')];

    const LEGAL_FORMS = {
        'ad': t('company.legal_forms.ad'),
        'ead': t('company.legal_forms.ead'),
        'eood': t('company.legal_forms.eood'),
        'et': t('company.legal_forms.et'),
        'ood': t('company.legal_forms.ood')
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setErrors({});
            const response = await api.post("/api/register/full", formData);
            const user = response.data.user;
            login(user);
            showAlert(t('registration.success'), "success");
            navigate('/');
        } catch (error) {
            console.log(error?.response);
            setErrors(error?.response?.data?.errors);
            showAlert(t('registration.failure'), "error");
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label={t('registration.user_name')}
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.user_name}
                            helperText={errors.user_name}
                        />
                        <TextField
                            label={t('registration.user_username')}
                            name="user_username"
                            value={formData.user_username}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.user_username}
                            helperText={errors.user_username}
                        />
                        <TextField
                            label={t('registration.user_password')}
                            type="password"
                            name="user_password"
                            value={formData.user_password}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.user_password}
                            helperText={errors.user_password}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label={t('registration.business_name')}
                            name="business_name"
                            value={formData.business_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.business_name}
                            helperText={errors.business_name}
                        />
                        <TextField
                            label={t('registration.business_username')}
                            name="business_username"
                            value={formData.business_username}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.business_username}
                            helperText={errors.business_username}
                        />
                        <TextField
                            label={t('registration.business_password')}
                            type="password"
                            name="business_password"
                            value={formData.business_password}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.business_password}
                            helperText={errors.business_password}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label={t('registration.manager_name')}
                            name="manager_name"
                            value={formData.manager_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.manager_name}
                            helperText={errors.manager_name}
                        />
                        <TextField
                            label={t('registration.company_name')}
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.company_name}
                            helperText={errors.company_name}
                        />
                        <TextField
                            label={t('registration.company_address')}
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.company_address}
                            helperText={errors.company_address}
                        />
                        <TextField
                            label={t('registration.legal_form')}
                            name="legal_form"
                            value={formData.legal_form}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            select
                            error={!!errors.legal_form}
                            helperText={errors.legal_form}
                        >
                            {Object.entries(LEGAL_FORMS).map(([key, label]) => (
                                <MenuItem key={key} value={key}>{label}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                );
            default:
                return <Typography>{t('registration.unknown_step')}</Typography>;
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 350, mx: "auto", p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{t(label)}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box mt={4}>{renderStepContent()}</Box>

            <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                >
                    {t('registration.back')}
                </Button>
                <Button onClick={handleNext} variant="contained">
                    {activeStep === steps.length - 1 ? t('registration.submit') : t('registration.next')}
                </Button>
            </Box>
        </Box>
    );
};

export default RegisterFull;