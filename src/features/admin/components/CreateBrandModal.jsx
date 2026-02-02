import { Box, Button, TextField } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AppModal from "../../../shared/components/AppModal";
import { useMemo, useState, useEffect } from "react";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2.2,
        bgcolor: "#fff",
        "& fieldset": { borderColor: "rgba(0,0,0,0.18)" },
        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.28)" },
        "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.28)" },
        fontSize: 15,
        fontWeight: "normal",
    },
    "& .MuiInputLabel-root": {
        fontWeight: 400,
        color: "rgba(0,0,0,0.45)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "rgba(0,0,0,0.55)",
    },
};

const initialForm = { name: "", description: "" };

export default function CreateBrandModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm);
    const [touched, setTouched] = useState({});

    const errors = useMemo(() => {
        const e = {};
        if (touched.name && !form.name.trim()) e.name = "El nombre es obligatorio";
        if (touched.description && !form.description.trim())
            e.description = "La descripción es obligatoria";
        return e;
    }, [form, touched]);

    const canSave =
        form.name.trim() &&
        form.description.trim() &&
        Object.keys(errors).length === 0;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

    const resetAll = () => {
        setForm(initialForm);
        setTouched({});
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    useEffect(() => {
        if (!open) resetAll();
    }, [open]);

    const handleSave = async () => {
        setTouched({ name: true, description: true });
        if (!canSave) return;

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
        };

        const ok = await onSubmit?.(payload);
        if (ok) handleClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Crear Marca"
            titleIcon={LocalOfferOutlinedIcon}
            maxWidth="md"
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                    label="Nombre de la marca"
                    value={form.name}
                    onChange={setVal("name")}
                    onBlur={touch("name")}
                    error={!!errors.name}
                    helperText={errors.name || " "}
                    sx={fieldSx}
                    fullWidth
                />

                <TextField
                    label="Descripción"
                    value={form.description}
                    onChange={setVal("description")}
                    onBlur={touch("description")}
                    error={!!errors.description}
                    helperText={errors.description || " "}
                    sx={fieldSx}
                    fullWidth
                    multiline
                    minRows={3}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 1 }}>
                    <Button
                        onClick={handleClose}
                        sx={{ textTransform: "none", color: "#5A2A1F", fontWeight: 500 }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={!canSave}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            borderRadius: 3,
                            px: 5,
                            py: 1.4,
                            fontWeight: 600,
                            bgcolor: "#501E14",
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#3B1710", boxShadow: "none" },
                            "&.Mui-disabled": { bgcolor: "#DAB4AF", color: "#FFFFFF" },
                        }}
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>
        </AppModal>
    );
}
