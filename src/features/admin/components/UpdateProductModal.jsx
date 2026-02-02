import { Autocomplete, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
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

const initialForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    brandId: "",
    categoryId: "",
};

export default function UpdateProductModal({
    open,
    onClose,
    onSubmit,
    productId, // 👈 id del producto a editar
}) {
    const [form, setForm] = useState(initialForm);

    // nuevas imágenes (File[])
    const [images, setImages] = useState([]);

    // imágenes existentes (del backend)
    const [existingImages, setExistingImages] = useState([]); // [{id,name,url}]
    const [removedExistingIds, setRemovedExistingIds] = useState(() => new Set());

    const [touched, setTouched] = useState({});

    // listas para selects
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);
    const [listsError, setListsError] = useState("");

    // loading del producto / imágenes
    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

    const selectedCategory = categories.find(c => String(c.id) === String(form.categoryId)) ?? null;
    const selectedBrand = brands.find((b) => String(b.id) === String(form.brandId)) ?? null;

    const errors = useMemo(() => {
        const e = {};
        if (touched.name && !form.name.trim()) e.name = "El nombre es obligatorio";
        if (touched.description && !form.description.trim()) e.description = "La descripción es obligatoria";
        if (touched.price && !String(form.price).trim()) e.price = "El precio es obligatorio";
        if (touched.stock && !String(form.stock).trim()) e.stock = "El stock es obligatorio";
        if (touched.brandId && !String(form.brandId).trim()) e.brandId = "La marca es obligatoria";
        if (touched.categoryId && !String(form.categoryId).trim()) e.categoryId = "La categoría es obligatoria";
        if (touched.price && String(form.price).trim() && Number(form.price) <= 0) e.price = "El precio debe ser mayor a 0";
        if (touched.stock && String(form.stock).trim() && Number(form.stock) <= 0) e.stock = "El stock debe ser mayor a 0";
        return e;
    }, [form, touched]);

    const canSave =
        form.name.trim() &&
        form.description.trim() &&
        String(form.price).trim() &&
        String(form.stock).trim() &&
        String(form.brandId).trim() &&
        String(form.categoryId).trim() &&
        Object.keys(errors).length === 0 &&
        !loadingEntity;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

    const resetAll = () => {
        setForm(initialForm);
        setImages([]);
        setExistingImages([]);
        setRemovedExistingIds(new Set());
        setTouched({});
        setEntityError("");
        setBrands([]);
        setCategories([]);
        setListsError("");
        setListsLoading(false);
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // 1) cargar brands/categories cuando abre (igual que en Create) :contentReference[oaicite:2]{index=2}
    useEffect(() => {
        if (!open) return;

        //if (brands.length && categories.length) return;

        let cancelled = false;

        (async () => {
            setListsLoading(true);
            setListsError("");

            try {
                const [bRes, cRes] = await Promise.all([
                    adminApi.fetchBrands(),
                    adminApi.fetchCategories(),
                ]);

                if (cancelled) return;

                if (bRes?.status !== "SUCCESS") throw new Error(bRes?.message || "Error brands");
                if (cRes?.status !== "SUCCESS") throw new Error(cRes?.message || "Error categories");

                setBrands(Array.isArray(bRes.data) ? bRes.data : []);
                setCategories(Array.isArray(cRes.data) ? cRes.data : []);
            } catch (e) {
                if (cancelled) return;
                setListsError("No se pudieron cargar Marcas/Categorías.");
                setBrands([]);
                setCategories([]);
            } finally {
                if (!cancelled) setListsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // 2) cargar producto + imágenes existentes al abrir
    useEffect(() => {
        if (!open) {
            resetAll();
            return;
        }
        if (!productId) return;

        let cancelled = false;

        (async () => {
            setLoadingEntity(true);
            setEntityError("");

            try {
                // a) producto
                const pRes = await adminApi.getProductById(productId);
                if (cancelled) return;

                if (pRes?.status !== "SUCCESS" || !pRes?.data) {
                    throw new Error(pRes?.message || "No se pudo cargar el producto");
                }

                const p = pRes.data;

                setForm({
                    name: p.name ?? "",
                    description: p.description ?? "",
                    price: String(p.price ?? ""),
                    stock: String(p.stock ?? ""),
                    brandId: String(p.brand?.id ?? ""),
                    categoryId: String(p.category?.id ?? ""),
                });

                // b) imágenes existentes
                const iRes = await adminApi.getProductImagesUrlByProductId(productId);
                if (cancelled) return;

                if (iRes?.status !== "SUCCESS") {
                    throw new Error(iRes?.message || "No se pudieron cargar las imágenes");
                }

                setExistingImages(Array.isArray(iRes.data) ? iRes.data : []);
                setRemovedExistingIds(new Set());
                setImages([]); // nuevas imágenes limpias al abrir
                setTouched({});
            } catch (e) {
                if (cancelled) return;
                setEntityError(e?.message || "Error cargando el producto");
            } finally {
                if (!cancelled) setLoadingEntity(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, productId]);

    // --- IMÁGENES: control de máximo 5 combinando existentes + nuevas ---
    const activeExisting = useMemo(() => {
        return existingImages.filter((img) => !removedExistingIds.has(img.id));
    }, [existingImages, removedExistingIds]);

    const remainingForNew = Math.max(0, 5 - activeExisting.length - images.length);

    const addImages = (files) => {
        if (!files?.length) return;
        setImages((prev) => {
            const incoming = Array.from(files);
            const onlyImages = incoming.filter((f) => f.type?.startsWith("image/"));
            const toTake = onlyImages.slice(0, remainingForNew);
            const next = [...prev, ...toTake];
            return next.slice(0, Math.max(0, 5 - activeExisting.length));
        });
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

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

    const handleSave = async () => {
        setTouched({
            name: true,
            description: true,
            price: true,
            stock: true,
            brandId: true,
            categoryId: true,
        });

        if (!canSave) return;

        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            brandId: Number(form.brandId),
            categoryId: Number(form.categoryId),
        };

        // para que luego manejes backend:
        // - payload: update product (PUT)
        // - images: nuevas imágenes (multipart)
        // - removedExistingIds: ids para borrar (si implementas delete)
        // - activeExisting: ids a mantener (si lo necesitas)
        const ok = await onSubmit?.(productId, payload, images, Array.from(removedExistingIds));

        handleClose();
    };

    const previewItems = useMemo(() => {
        return existingImages.map((img) => ({
            id: img.id,
            name: img.name,
            url: img.url,
            removed: removedExistingIds.has(img.id),
        }));
    }, [existingImages, removedExistingIds]);

    const MENU_PROPS = {
        PaperProps: {
            sx: {
                maxHeight: { xs: "40vh", sm: 320 },
                overflowY: "auto",
            },
        },
        MenuListProps: {
            sx: { py: 0 },
        },
    };

    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title="Editar Producto"
            titleIcon={ShoppingBagOutlinedIcon}
            maxWidth="md"
        >
            <ActionModal
                open={open && loadingEntity}
                variant="loading"
                title="Cargando"
                message="Cargando información del producto..."
                onClose={() => { }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {entityError ? (
                    <Typography sx={{ color: "#9B2C2C", fontSize: 13, mb: 1 }}>
                        {entityError}
                    </Typography>
                ) : null}

                {loadingEntity ? (
                    <Box sx={{ height: 500 }} />
                ) : (
                    <>
                        <TextField
                            label="Nombre del producto"
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
                            label="Descripción del producto"
                            value={form.description}
                            onChange={setVal("description")}
                            onBlur={touch("description")}
                            error={!!errors.description}
                            helperText={errors.description || " "}
                            sx={fieldSx}
                            fullWidth
                            multiline
                            minRows={2}
                            disabled={loadingEntity}
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField
                                label="Precio"
                                value={form.price}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (/^\d*\.?\d*$/.test(v)) setForm((s) => ({ ...s, price: v }));
                                }}
                                onBlur={() => {
                                    touch("price")();
                                    setForm((s) => ({
                                        ...s,
                                        price: String(s.price).endsWith(".") ? String(s.price).slice(0, -1) : s.price,
                                    }));
                                }}
                                error={!!errors.price}
                                helperText={errors.price || " "}
                                sx={fieldSx}
                                fullWidth
                                disabled={loadingEntity}
                                inputProps={{ inputMode: "decimal", pattern: "^\\d*\\.?\\d*$" }}
                            />

                            <TextField
                                label="Stock"
                                value={form.stock}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (/^\d*$/.test(v)) setForm((s) => ({ ...s, stock: v }));
                                }}
                                onBlur={touch("stock")}
                                error={!!errors.stock}
                                helperText={errors.stock || " "}
                                sx={fieldSx}
                                fullWidth
                                disabled={loadingEntity}
                                inputProps={{ inputMode: "numeric", pattern: "^\\d*$" }}
                            />
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <Autocomplete
                                options={brands}
                                value={selectedBrand}
                                onChange={(_, newValue) => {
                                    setForm((s) => ({ ...s, brandId: newValue ? String(newValue.id) : "" }));
                                }}
                                getOptionLabel={(option) => option?.name ?? ""}
                                isOptionEqualToValue={(option, value) =>
                                    String(option.id) === String(value.id)
                                }
                                loading={listsLoading}
                                disabled={listsLoading || !!listsError || loadingEntity}
                                openOnFocus
                                autoHighlight
                                ListboxProps={{ style: { maxHeight: 320, overflow: "auto" } }} // ✅ overflow
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Marca"
                                        placeholder="Seleccione"
                                        onBlur={touch("brandId")}
                                        error={!!errors.brandId}
                                        helperText={errors.brandId || listsError || " "}
                                        sx={fieldSx}
                                        fullWidth
                                    />
                                )}
                            />

                            <Autocomplete
                                options={categories}
                                value={selectedCategory}
                                onChange={(_, newValue) => {
                                    setForm((s) => ({
                                        ...s,
                                        categoryId: newValue ? String(newValue.id) : "",
                                    }));
                                }}
                                getOptionLabel={(option) => option?.name ?? ""}
                                isOptionEqualToValue={(option, value) =>
                                    String(option.id) === String(value.id)
                                }
                                loading={listsLoading}
                                disabled={listsLoading || !!listsError || loadingEntity}
                                openOnFocus
                                autoHighlight
                                ListboxProps={{ style: { maxHeight: 320, overflow: "auto" } }} // ✅ overflow
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categoría"
                                        placeholder="Seleccione"
                                        onBlur={touch("categoryId")}
                                        error={!!errors.categoryId}
                                        helperText={errors.categoryId || listsError || " "}
                                        sx={fieldSx}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                        <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
                            Máximo 5 imágenes {activeExisting.length + images.length}/5
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <ImageDropzone
                                files={images}
                                onAddFiles={addImages}
                                onRemoveFile={removeNewImage}
                                previews={previewItems}
                                onTogglePreview={(id) => {
                                    const removed = removedExistingIds.has(id);
                                    removed ? undoExisting(id) : removeExisting(id);
                                }}
                                maxFiles={5}
                                helperText="Arrastra una imagen para cargarla"
                                buttonText="Subir imagen"
                            />
                        </Box>

                        {/* Actions */}
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
