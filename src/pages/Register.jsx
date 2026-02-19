import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { useAlert } from "../contexts/AlertContext";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../contexts/TranslationContext";

const Register = () => {
  const { t } = useTranslations();
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: "",
    user_username: "",
    user_password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      const response = await api.post("/api/register", formData);
      const user = response.data.user;
      login(user);
      showAlert(t("registration.success"), "success");
      navigate("/");
    } catch (error) {
      console.error(error?.response);
      setErrors(error?.response?.data?.errors || {});
      showAlert(t("registration.failure"), "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 350, mx: "auto", p: 2 }}
    >
      <Typography variant="h5" mb={2}>
        {t("registration.title")}
      </Typography>

      <TextField
        label={t("registration.name")}
        name="user_name"
        value={formData.user_name}
        onChange={handleChange}
        variant="standard"
        fullWidth
        margin="normal"
        error={!!errors.user_name}
        helperText={errors.user_name}
      />

      <TextField
        label={t("registration.username")}
        name="user_username"
        value={formData.user_username}
        onChange={handleChange}
        variant="standard"
        fullWidth
        margin="normal"
        error={!!errors.user_username}
        helperText={errors.user_username}
      />

      <TextField
        label={t("registration.password")}
        type="password"
        name="user_password"
        value={formData.user_password}
        onChange={handleChange}
        variant="standard"
        fullWidth
        margin="normal"
        error={!!errors.user_password}
        helperText={errors.user_password}
      />

      <Typography mt={2}>{t("registration.role")}</Typography>
      <RadioGroup
        row
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        <FormControlLabel
          value="user"
          control={<Radio />}
          label={t("registration.user")}
        />
        <FormControlLabel
          value="business"
          control={<Radio />}
          label={t("registration.company")}
        />
      </RadioGroup>
      {errors.role && (
        <Typography color="error" variant="caption">
          {errors.role}
        </Typography>
      )}

      <Box mt={3}>
        <Button type="submit" fullWidth variant="contained">
          {t("registration.submit")}
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
