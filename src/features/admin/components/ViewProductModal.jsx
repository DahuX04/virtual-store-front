import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
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

const viewFieldSx = {
    ...fieldSx,
    // ✅ que disabled NO cambie el "look" (mantiene padding/altura como en Update)
    "& .MuiInputBase-root.Mui-disabled": { opacity: 1 },
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(0,0,0,0.78)",
    },
    "& .MuiSelect-select.Mui-disabled": {
        WebkitTextFillColor: "rgba(0,0,0,0.78)",
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

export default function ViewProductModal({ open, onClose, productId }) {
    const [form, setForm] = useState(initialForm);

    // imágenes existentes (del backend)
    const [existingImages, setExistingImages] = useState([]); // [{id,name,url}]

    // listas para selects (solo para que el select muestre el label correcto)
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);
    const [listsError, setListsError] = useState("");

    // loading del producto / imágenes
    const [loadingEntity, setLoadingEntity] = useState(false);
    const [entityError, setEntityError] = useState("");

    // guardo los objetos del producto por si falla la carga de listas (para que el select muestre el nombre)
    const [selectedBrand, setSelectedBrand] = useState(null);     // {id,name}
    const [selectedCategory, setSelectedCategory] = useState(null); // {id,name}

    const resetAll = () => {
        setForm(initialForm);
        setExistingImages([]);
        setEntityError("");
        setSelectedBrand(null);
        setSelectedCategory(null);
    };

    const handleClose = () => {
        resetAll();
        onClose?.();
    };

    // 1) cargar brands/categories cuando abre (igual que Update)
    useEffect(() => {
        if (!open) return;

        if (brands.length && categories.length) return;

        let cancelled = false;

        (async () => {
            setListsLoading(true);
            setListsError("");

            try {
                const [bRes, cRes] = await Promise.all([adminApi.fetchBrands(), adminApi.fetchCategories()]);

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

                setSelectedBrand(p.brand?.id ? { id: p.brand.id, name: p.brand.name } : null);
                setSelectedCategory(p.category?.id ? { id: p.category.id, name: p.category.name } : null);

                // b) imágenes existentes
                const iRes = await adminApi.getProductImagesUrlByProductId(productId);
                if (cancelled) return;

                if (iRes?.status !== "SUCCESS") {
                    throw new Error(iRes?.message || "No se pudieron cargar las imágenes");
                }

                setExistingImages(Array.isArray(iRes.data) ? iRes.data : []);
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

    // ✅ aseguro que el select muestre el nombre aunque las listas fallen
    const brandOptions = useMemo(() => {
        const arr = Array.isArray(brands) ? brands : [];
        if (selectedBrand?.id && !arr.some((b) => String(b.id) === String(selectedBrand.id))) {
            return [selectedBrand, ...arr];
        }
        return arr;
    }, [brands, selectedBrand]);

    const categoryOptions = useMemo(() => {
        const arr = Array.isArray(categories) ? categories : [];
        if (selectedCategory?.id && !arr.some((c) => String(c.id) === String(selectedCategory.id))) {
            return [selectedCategory, ...arr];
        }
        return arr;
    }, [categories, selectedCategory]);

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
            title="Ver Producto"
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
                            sx={viewFieldSx}
                            fullWidth
                            disabled
                            helperText=" "
                        />

                        <TextField
                            label="Descripción del producto"
                            value={form.description}
                            sx={viewFieldSx}
                            fullWidth
                            multiline
                            minRows={2}
                            disabled
                            helperText=" "
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField
                                label="Precio"
                                value={form.price}
                                sx={viewFieldSx}
                                fullWidth
                                disabled
                                helperText=" "
                            />

                            <TextField
                                label="Stock"
                                value={form.stock}
                                sx={viewFieldSx}
                                fullWidth
                                disabled
                                helperText=" "
                            />
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField
                                select
                                label="Marca"
                                value={form.brandId}
                                sx={viewFieldSx}
                                fullWidth
                                disabled
                                SelectProps={{
                                    MenuProps: {
                                        disableScrollLock: true,
                                        TransitionProps: { timeout: 0 },
                                    },
                                }}
                                helperText=" "
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {listsLoading ? (
                                    <MenuItem value="" disabled>
                                        Cargando...
                                    </MenuItem>
                                ) : (
                                    brandOptions.map((b) => (
                                        <MenuItem key={b.id} value={String(b.id)}>
                                            {b.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>

                            <TextField
                                select
                                label="Categoría"
                                value={form.categoryId}
                                sx={viewFieldSx}
                                fullWidth
                                disabled
                                SelectProps={{
                                    MenuProps: {
                                        disableScrollLock: true,
                                        TransitionProps: { timeout: 0 },
                                    },
                                }}
                                helperText=" "
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                {listsLoading ? (
                                    <MenuItem value="" disabled>
                                        Cargando...
                                    </MenuItem>
                                ) : (
                                    categoryOptions.map((c) => (
                                        <MenuItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Box>

                        <Typography sx={{ fontSize: 12.5, color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
                            Imágenes {previewItems.length}/5
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <ImageDropzone
                                readOnly
                                previews={previewItems}
                                maxFiles={5}
                                helperText=""   // no se usa en readOnly
                                buttonText=""   // no se usa en readOnly
                            />
                        </Box>

                        {/* Actions */}
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
