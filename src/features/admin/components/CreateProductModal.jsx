import { Autocomplete, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AppModal from "../../../shared/components/AppModal";
import ImageDropzone from "../../../shared/components/ImagenDropzone";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import adminApi from "../api/AdminApi";

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

export default function CreateProductModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        brandId: "",
        categoryId: "",
    });
    const [images, setImages] = useState([]); // File[]
    const [touched, setTouched] = useState({});
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);
    const [listsError, setListsError] = useState("");
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
        return e;
    }, [form, touched]);

    const canSave =
        form.name.trim() &&
        form.description.trim() &&
        String(form.price).trim() &&
        String(form.stock).trim() &&
        String(form.brandId).trim() &&
        String(form.categoryId).trim() &&
        Object.keys(errors).length === 0;

    const setVal = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const touch = (k) => () => setTouched((s) => ({ ...s, [k]: true }));

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
    }, [open]);

    const addImages = (files) => {
        setImages((prev) => {
            const next = [...prev, ...files];
            return next.slice(0, 5);
        });
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const resetAll = () => {
        setForm(initialForm);
        setImages([]);
        setTouched({});
        setBrands([]);
        setCategories([]);
        setListsError("");
        setListsLoading(false);
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
        // opcional: reset al cerrar
        // setForm({ name:"", description:"", price:"", stock:"", brandId:"", categoryId:"" });
        // setImages([]);
        // setTouched({});
    };

    useEffect(() => {
        if (!open) resetAll();
    }, [open]);

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

        // Tu backend para producto seguramente es JSON + luego multipart para imágenes.
        // Aquí solo devolvemos data y File[] (en memoria).
        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            brandId: Number(form.brandId),
            categoryId: Number(form.categoryId),
        };

        const ok = await onSubmit?.(payload, images);
        if (ok) handleClose();
    };

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
            title="Crear Producto"
            titleIcon={ShoppingBagOutlinedIcon}
            maxWidth="md"
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                    label="Nombre del producto"
                    value={form.name}
                    onChange={setVal("name")}
                    onBlur={touch("name")}
                    error={!!errors.name}
                    helperText={errors.name || " "}
                    sx={fieldSx}
                    fullWidth
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
                />

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                        label="Precio"
                        value={form.price}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^\d*\.?\d*$/.test(v)) {
                                setForm((s) => ({ ...s, price: v }));
                            }
                        }}
                        onBlur={() => {
                            touch("price")();
                            setForm((s) => ({ ...s, price: String(s.price).endsWith(".") ? String(s.price).slice(0, -1) : s.price }));
                        }}
                        error={!!errors.price}
                        helperText={errors.price || " "}
                        sx={fieldSx}
                        fullWidth
                        inputProps={{
                            inputMode: "decimal",
                            pattern: "^\\d*\\.?\\d*$",
                        }}
                    />
                    <TextField
                        label="Stock"
                        value={form.stock}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^\d*$/.test(v)) {
                                setForm((s) => ({ ...s, stock: v }));
                            }
                        }}
                        onBlur={touch("stock")}
                        error={!!errors.stock}
                        helperText={errors.stock || " "}
                        sx={fieldSx}
                        fullWidth
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "^\\d*$",
                        }}
                    />
                </Box>

                {/* Por ahora “mock” selects, luego los llenas con API */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Autocomplete
                        options={brands}
                        value={selectedBrand}
                        onChange={(_, newValue) => {
                            // newValue es el objeto marca seleccionado (o null si limpias)
                            setForm((s) => ({ ...s, brandId: newValue ? String(newValue.id) : "" }));
                        }}
                        getOptionLabel={(option) => option?.name ?? ""}
                        isOptionEqualToValue={(option, value) =>
                            String(option.id) === String(value.id)
                        }
                        loading={listsLoading}
                        disabled={listsLoading || !!listsError}
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
                        disabled={listsLoading || !!listsError}
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

                <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)" }}>
                    Máximo 5 imágenes (solo imágenes).
                </Typography>

                <ImageDropzone
                    files={images}
                    onAddFiles={addImages}
                    onRemoveFile={removeImage}
                    maxFiles={5}
                    helperText="Arrastra una imagen para cargarla"
                    buttonText="Subir imagen"
                />

                {/* Actions */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 1 }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            textTransform: "none",
                            color: "#5A2A1F",
                            fontWeight: 500,
                        }}
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
