import { Box, Button, TextField, Typography } from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AppModal from "../../../shared/components/AppModal";
import ImageDropzone from "../../../shared/components/ImagenDropzone";
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

const initialForm = { name: "" };

export default function CreateCategoryModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm);
    const [image, setImage] = useState([]); // File[] (0..1)
    const [touched, setTouched] = useState({});

    const errors = useMemo(() => {
        const e = {};
        if (touched.name && !form.name.trim()) e.name = "El nombre es obligatorio";
        return e;
    }, [form, touched]);

    const canSave = form.name.trim() && Object.keys(errors).length === 0;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

    const addImage = (files) => {
        // max 1
        const file = files?.[0];
        if (!file) return;
        setImage([file]);
    };

    const removeImage = () => setImage([]);

    const resetAll = () => {
        setForm(initialForm);
        setImage([]);
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
        setTouched({ name: true });
        if (!canSave) return;

        const payload = { name: form.name.trim() };

        // images array (0..1) igual patrón que CreateProductModal
        const ok = await onSubmit?.(payload, image);
        if (ok) handleClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Crear Categoría"
            titleIcon={CategoryOutlinedIcon}
            maxWidth="md"
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                    label="Nombre de la categoría"
                    value={form.name}
                    onChange={setVal("name")}
                    onBlur={touch("name")}
                    error={!!errors.name}
                    helperText={errors.name || " "}
                    sx={fieldSx}
                    fullWidth
                />

                <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)" }}>
                    Máximo 1 imagen (solo imágenes).
                </Typography>

                <ImageDropzone
                    files={image}
                    onAddFiles={addImage}
                    onRemoveFile={() => removeImage()}
                    maxFiles={1}
                    helperText="Arrastra una imagen para cargarla"
                    buttonText="Subir imagen"
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
