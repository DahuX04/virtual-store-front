import { Box, Button, TextField, Typography } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AppModal from "../../../shared/components/AppModal";
import { useEffect, useState } from "react";
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

const viewFieldSx = {
    ...fieldSx,
    // ✅ que disabled NO cambie el look (igual que category view)
    "& .MuiInputBase-root.Mui-disabled": { opacity: 1 },
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(0,0,0,0.78)",
    },
};

const initialForm = { name: "", description: "" };

export default function ViewBrandModal({ open, onClose, brandId }) {
    const [form, setForm] = useState(initialForm);
    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

    const resetAll = () => {
        setForm(initialForm);
        setEntityError("");
        setLoadingEntity(false);
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // 1) cargar brand al abrir
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

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Ver Marca"
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
                    <Box sx={{ height: 320 }} />
                ) : (
                    <>
                        <TextField
                            label="Nombre de la marca"
                            value={form.name}
                            sx={viewFieldSx}
                            fullWidth
                            disabled
                            helperText=" "
                        />

                        <TextField
                            label="Descripción"
                            value={form.description}
                            sx={viewFieldSx}
                            fullWidth
                            disabled
                            multiline
                            minRows={3}
                            helperText=" "
                        />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 1 }}>
                            <Button
                                onClick={handleClose}
                                sx={{ textTransform: "none", color: "#5A2A1F", fontWeight: 500 }}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </AppModal>
    );
}
