import React, { useState } from "react";
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
import axios from "axios";
import { useAlert } from "../contexts/AlertContext";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const steps = ["User", "Business", "Company"];

const LEGAL_FORMS = {
    'ad': 'PLC',
    'ead': 'Sole PLC',
    'eood': 'Ltd (Sole)',
    'et': 'Sole Trader',
    'ood': 'Ltd'
};

const RegisterFull = () => {
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
            login(user)
            showAlert("Registration successful! Logged in.", "success");
            navigate('/');
        } catch (error) {
            console.log(error?.response)
            setErrors(error?.response?.data?.errors);
            showAlert("Registration failed.", "error");
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="User Name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.user_name}
                            helperText={errors.user_name}
                        />
                        <TextField
                            label="Username"
                            name="user_username"
                            value={formData.user_username}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.user_username}
                            helperText={errors.user_username}
                        />
                        <TextField
                            label="Password"
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
                            label="Business Name"
                            name="business_name"
                            value={formData.business_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.business_name}
                            helperText={errors.business_name}
                        />
                        <TextField
                            label="Username"
                            name="business_username"
                            value={formData.business_username}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.business_username}
                            helperText={errors.business_username}
                        />
                        <TextField
                            label="Password"
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
                            label="Manager Name"
                            name="manager_name"
                            value={formData.manager_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.manager_name}
                            helperText={errors.manager_name}
                        />
                        <TextField
                            label="Company Name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.company_name}
                            helperText={errors.company_name}
                        />
                        <TextField
                            label="Address"
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            error={!!errors.company_address}
                            helperText={errors.company_address}
                        />
                        <TextField
                            label="Legal Form"
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
                return <Typography>Unknown step</Typography>;
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 350, mx: "auto", p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
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
                    Back
                </Button>
                <Button onClick={handleNext} variant="contained">
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
            </Box>
        </Box>
    );
};

export default RegisterFull;
