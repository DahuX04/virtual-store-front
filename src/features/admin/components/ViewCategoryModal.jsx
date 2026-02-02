import { Box, Button, TextField, Typography } from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AppModal from "../../../shared/components/AppModal";
import ImageDropzone from "../../../shared/components/ImagenDropzone";
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

const viewFieldSx = {
    ...fieldSx,
    // ✅ que disabled NO cambie el "look"
    "& .MuiInputBase-root.Mui-disabled": { opacity: 1 },
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(0,0,0,0.78)",
    },
};

const initialForm = { name: "" };

export default function ViewCategoryModal({ open, onClose, categoryId }) {
    const [form, setForm] = useState(initialForm);

    // imagen existente (del backend)
    const [existingImages, setExistingImages] = useState([]); // [{id,name,url}]

    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

    const resetAll = () => {
        setForm(initialForm);
        setExistingImages([]);
        setEntityError("");
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // cargar categoría + imagen al abrir
    useEffect(() => {
        if (!open) {
            resetAll();
            return;
        }
        if (!categoryId) return;

        let cancelled = false;

        (async () => {
            setLoadingEntity(true);
            setEntityError("");

            try {
                // a) categoría
                const cRes = await adminApi.getCategoryById(categoryId);
                if (cancelled) return;

                if (cRes?.status !== "SUCCESS" || !cRes?.data) {
                    throw new Error(cRes?.message || "No se pudo cargar la categoría");
                }

                const c = cRes.data;

                setForm({
                    name: c.name ?? "",
                });

                // b) imagen (endpoint puede devolver 1 objeto o array, normalizamos)
                const iRes = await adminApi.getCategoryImageUrlByCategoryId(categoryId);
                if (cancelled) return;

                if (iRes?.status !== "SUCCESS") {
                    throw new Error(iRes?.message || "No se pudo cargar la imagen");
                }

                const data = iRes?.data;
                const normalized = Array.isArray(data) ? data : data ? [data] : [];

                setExistingImages(normalized);
            } catch (e) {
                if (cancelled) return;
                setEntityError(e?.message || "Error cargando la categoría");
            } finally {
                if (!cancelled) setLoadingEntity(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, categoryId]);

    const previewItems = useMemo(() => {
        return existingImages.map((img) => ({
            id: img.id,
            name: img.name,
            url: img.url,
            removed: false,
        }));
    }, [existingImages]);

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Ver Categoría"
            titleIcon={CategoryOutlinedIcon}
            maxWidth="md"
        >
            <ActionModal
                open={open && loadingEntity}
                variant="loading"
                title="Cargando"
                message="Cargando información de la categoría..."
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
                            label="Nombre de la categoría"
                            value={form.name}
                            sx={viewFieldSx}
                            fullWidth
                            disabled
                            helperText=" "
                        />

                        <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
                            Imagen {previewItems.length}/1
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <ImageDropzone
                                readOnly
                                previews={previewItems}
                                maxFiles={1}
                                helperText="" // no se usa en readOnly
                                buttonText="" // no se usa en readOnly
                            />
                        </Box>

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
