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

const initialForm = { name: "" };

export default function UpdateCategoryModal({
    open,
    onClose,
    onSubmit,
    categoryId, // 👈 id de la categoría a editar
}) {
    const [form, setForm] = useState(initialForm);

    // nueva imagen (File[]) (0..1)
    const [image, setImage] = useState([]);

    // imagen existente (del backend)
    const [existingImages, setExistingImages] = useState([]); // [{id,name,url}]
    const [removedExistingIds, setRemovedExistingIds] = useState(() => new Set());

    const [touched, setTouched] = useState({});

    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

    const errors = useMemo(() => {
        const e = {};
        if (touched.name && !form.name.trim()) e.name = "El nombre es obligatorio";
        return e;
    }, [form, touched]);

    const canSave = form.name.trim() && Object.keys(errors).length === 0 && !loadingEntity;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

    const resetAll = () => {
        setForm(initialForm);
        setImage([]);
        setExistingImages([]);
        setRemovedExistingIds(new Set());
        setTouched({});
        setEntityError("");
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // 1) cargar categoría + imagen al abrir
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

                // b) imagen existente (si tu endpoint devuelve 1 objeto o array, normalizamos)
                const iRes = await adminApi.getCategoryImageUrlByCategoryId(categoryId);
                if (cancelled) return;

                if (iRes?.status !== "SUCCESS") {
                    throw new Error(iRes?.message || "No se pudo cargar la imagen");
                }

                const data = iRes?.data;
                const normalized = Array.isArray(data) ? data : data ? [data] : [];

                setExistingImages(normalized);
                setRemovedExistingIds(new Set());
                setImage([]);
                setTouched({});
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

    // --- IMÁGENES: máximo 1 combinando existentes + nueva ---
    const activeExisting = useMemo(() => {
        return existingImages.filter((img) => !removedExistingIds.has(img.id));
    }, [existingImages, removedExistingIds]);

    const totalCount = activeExisting.length + image.length;

    const addImage = (files) => {
        if (!files?.length) return;

        const incoming = Array.from(files);
        const onlyImages = incoming.filter((f) => f.type?.startsWith("image/"));
        const file = onlyImages[0];
        if (!file) return;

        // Reemplaza siempre la nueva
        setImage([file]);

        // Si hay una existente activa, la marcamos como removida para respetar max 1
        const firstExisting = activeExisting[0];
        if (firstExisting) {
            setRemovedExistingIds((prev) => {
                const next = new Set(prev);
                next.add(firstExisting.id);
                return next;
            });
        }
    };

    const removeNewImage = () => setImage([]);

    const removeExisting = (id) => {
        setRemovedExistingIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    const undoExisting = (id) => {
        setRemovedExistingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const previewItems = useMemo(() => {
        return existingImages.map((img) => ({
            id: img.id,
            name: img.name,
            url: img.url,
            removed: removedExistingIds.has(img.id),
        }));
    }, [existingImages, removedExistingIds]);

    const handleSave = async () => {
        setTouched({ name: true });
        if (!canSave) return;

        const payload = { name: form.name.trim() };

        // Para backend:
        // - payload: update category (PUT)
        // - image: nueva imagen (multipart) (0..1)
        // - removedExistingIds: ids a borrar (si implementas delete)
        const ok = await onSubmit?.(categoryId, payload, image, Array.from(removedExistingIds));

        // Igual que tu UpdateProductModal (cierra al final)
        handleClose();
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Editar Categoría"
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
                    <Box sx={{ height: 300 }} />
                ) : (
                    <>
                        <TextField
                            label="Nombre de la categoría"
                            value={form.name}
                            onChange={setVal("name")}
                            onBlur={touch("name")}
                            error={!!errors.name}
                            helperText={errors.name || " "}
                            sx={fieldSx}
                            fullWidth
                            disabled={loadingEntity}
                        />

                        <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
                            Máximo 1 imagen {totalCount}/1
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <ImageDropzone
                                files={image}
                                onAddFiles={addImage}
                                onRemoveFile={() => removeNewImage()}
                                previews={previewItems}
                                onTogglePreview={(id) => {
                                    const removed = removedExistingIds.has(id);
                                    removed ? undoExisting(id) : removeExisting(id);
                                }}
                                maxFiles={1}
                                helperText="Arrastra una imagen para cargarla"
                                buttonText="Subir imagen"
                            />
                        </Box>

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
