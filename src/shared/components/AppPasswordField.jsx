import { IconButton, InputAdornment } from "@mui/material";
import AppTextField from "./AppTextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AppPasswordField({
    value,
    onChange,
    onBlur,
    showPassword,
    onToggleShowPassword,
    label = "Contraseña",
    placeholder = "••••••••••••••",
    error,
    helperText,
    autoComplete = "current-password",
    ...rest
}) {
    return (
        <AppTextField
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            error={error}
            helperText={helperText || " "}
            inputProps={{ autoComplete }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{ pl: 1 }}>
                        <IconButton
                            aria-label="Mostrar contraseña"
                            onClick={onToggleShowPassword}
                            edge="end"
                            sx={{ mr: 0.5 }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    );
}
