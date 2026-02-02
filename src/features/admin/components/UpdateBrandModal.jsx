import { Box, Button, TextField, Typography } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AppModal from "../../../shared/components/AppModal";
import { useEffect, useMemo, useState } from "react";
import adminApi from "../api/AdminApi";
import ActionModal from "./ActionModal";

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

export default function UpdateBrandModal({
    open,
    onClose,
    onSubmit,
    brandId, // 👈 id de la marca a editar
}) {
    const [form, setForm] = useState(initialForm);
    const [touched, setTouched] = useState({});

    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

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
        Object.keys(errors).length === 0 &&
        !loadingEntity;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

    const resetAll = () => {
        setForm(initialForm);
        setTouched({});
        setEntityError("");
        setLoadingEntity(false);
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // 1) cargar marca al abrir
    useEffect(() => {
        if (!open) {
            resetAll();
            return;
        }
        if (!brandId) return;

        let cancelled = false;

        (async () => {
            setLoadingEntity(true);
            setEntityError("");

            try {
                // ✅ Ajusta el nombre si tu API usa otro método
                const bRes = await adminApi.getBrandById(brandId);
                if (cancelled) return;

                if (bRes?.status !== "SUCCESS" || !bRes?.data) {
                    throw new Error(bRes?.message || "No se pudo cargar la marca");
                }

                const b = bRes.data;

                setForm({
                    name: b.name ?? "",
                    description: b.description ?? "",
                });

                setTouched({});
            } catch (e) {
                if (cancelled) return;
                setEntityError(e?.message || "Error cargando la marca");
            } finally {
                if (!cancelled) setLoadingEntity(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, brandId]);

    const handleSave = async () => {
        setTouched({ name: true, description: true });
        if (!canSave) return;

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
        };

        await onSubmit?.(brandId, payload);

        // Igual que tu UpdateCategoryModal
        handleClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Editar Marca"
            titleIcon={LocalOfferOutlinedIcon}
            maxWidth="md"
        >
            <ActionModal
                open={open && loadingEntity}
                variant="loading"
                title="Cargando"
                message="Cargando información de la marca..."
                onClose={() => { }}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {entityError ? (
                    <Typography sx={{ color: "#9B2C2C", fontSize: 13, mb: 1 }}>
                        {entityError}
                    </Typography>
                ) : null}

                {loadingEntity ? (
                    <Box sx={{ height: 300 }} />
                ) : (
                    <>
                        <TextField
                            label="Nombre de la marca"
                            value={form.name}
                            onChange={setVal("name")}
                            onBlur={touch("name")}
                            error={!!errors.name}
                            helperText={errors.name || " "}
                            sx={fieldSx}
                            fullWidth
                            disabled={loadingEntity}
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
                            disabled={loadingEntity}
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
                                Guardar cambios
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </AppModal>
    );
}
