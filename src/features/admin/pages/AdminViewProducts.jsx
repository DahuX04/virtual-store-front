import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CreateProductModal from "../components/CreateProductModal";
import adminApi from "../api/AdminApi";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UpdateProductModal from "../components/UpdateProductModal";
import ActionModal from "../components/ActionModal";
import ViewProductModal from "../components/ViewProductModal";
import CreateCategoryModal from "../components/CreateCategoryModal";
import UpdateCategoryModal from "../components/UpdateCategoryModal";
import ViewCategoryModal from "../components/ViewCategoryModal";

export default function AdminViewDashboard() {

    const [openCreate, setOpenCreate] = useState(false);
    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [openEditCategory, setOpenEditCategory] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [view, setView] = useState("products");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [openView, setOpenView] = useState(false);
    const [viewId, setViewId] = useState(null);
    const [categoryViewId, setCategoryViewId] = useState()
    const [openCategoryView, setOpenCategoryView] = useState(false);

    const [uiModal, setUiModal] = useState({
        open: false,
        variant: "loading",
        title: "",
        message: "",
        onConfirm: null,
    });

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [q, setQ] = useState("");
    const [qDebounced, setQDebounced] = useState("");

    const closeUiModal = () => setUiModal((s) => ({ ...s, open: false, onConfirm: null }));

    const openLoading = (message = "Procesando...") =>
        setUiModal({ open: true, variant: "loading", title: "Procesando", message, onConfirm: null });

    const openError = (message = "Se produjo un error al procesar la solicitud") =>
        setUiModal({ open: true, variant: "error", title: "Ha ocurrido un error", message, onConfirm: null });

    const openSuccess = (message = "Operación realizada correctamente") =>
        setUiModal({ open: true, variant: "success", title: "Mensaje de éxito", message, onConfirm: null });

    const openConfirm = ({ title, message, onConfirm }) =>
        setUiModal({ open: true, variant: "confirm", title, message, onConfirm });

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            setQDebounced(q.trim());
        }, 420);

        return () => clearTimeout(t);
    }, [q]);

    const rangeText = useMemo(() => {
        if (totalElements === 0) return `0 - 0 de 0`;
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, totalElements);
        return `${start} - ${end} de ${totalElements}`;
    }, [page, pageSize, totalElements]);

    const handleCreate = async (payload, images) => {
        try {
            // 1) crear producto
            const created = await adminApi.createProduct(payload);

            if (!created || created.status !== "SUCCESS") {
                throw new Error(created?.message || "No se pudo crear el producto.");
            }

            const productId = created?.data?.id;
            if (!productId) {
                throw new Error("El backend no devolvió el id del producto creado.");
            }

            // 2) subir imágenes (si hay)
            if (Array.isArray(images) && images.length > 0) {
                const fd = new FormData();
                images.forEach((file) => fd.append("files", file));

                // OJO: esto debe coincidir con tu Controller (@RequestParam)
                fd.append("name", created?.data?.name ?? payload.name);

                // Si tu backend usa productId:
                fd.append("productId", String(productId));

                // Si tu backend usa product_id (como lo escribiste):
                // fd.append("product_id", String(productId));

                const imgRes = await adminApi.createProductImages(fd);

                if (!imgRes || imgRes.status !== "SUCCESS") {
                    throw new Error(imgRes?.message || "No se pudieron subir las imágenes.");
                }
            }

            // 3) refrescar lista para ver el nuevo (como ordenas desc por id, lo verás en la 1ra página)
            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.fetchProducts(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setProducts(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }
        } catch (e) {
            // muestra error en tu UI si quieres (por ahora al menos en la pantalla)
            //setErrorText(e?.message || "Error creando producto.");
            throw e; // importante: así el modal NO se cierra
        }
    };

    const handleCreateWithModals = async (payload, images) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Crear producto?",
                message: "Se creará el producto con los datos ingresados.",
                onConfirm: async () => {
                    openLoading("Creando producto...");
                    try {
                        await handleCreate(payload, images);
                        openSuccess("Producto creado correctamente.");
                        resolve(true); // <- esto hará que CreateProductModal cierre
                    } catch (e) {
                        openError(e?.message);
                        reject(e); // <- esto NO cerrará (porque devolvimos false/throw)
                    }
                },
            });
        });
    };

    const handleCreateCategory = async (payload, images) => {

        try {
            const created = await adminApi.createCategory(payload);

            if (!created || created.status !== "SUCCESS") {
                throw new Error(created?.message || "No se pudo crear la categoría.");
            }

            const categoryId = created?.data?.id;
            if (!categoryId) {
                throw new Error("El backend no devolvió el id de la categoría creada.");
            }

            // 2) subir imágenes (si hay)
            if (Array.isArray(images) && images.length > 0) {

                const file = images[0];

                const fd = new FormData();
                fd.append("file", file);

                fd.append("name", created?.data?.name ?? payload.name);

                fd.append("categoryId", String(categoryId));

                const imgRes = await adminApi.createCategoryImage(fd);

                if (!imgRes || imgRes.status !== "SUCCESS") {
                    throw new Error(imgRes?.message || "No se pudieron subir las imágenes.");
                }

            }

            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.getCategoriesPaged(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setCategories(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }

        } catch (e) {
            //setErrorText(e?.message || "Error creando categoría.");
            throw e;
        }


    };

    const handleCreateCategoryWithModals = async (payload, images) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Crear categoría?",
                message: "Se creará la categoría con los datos ingresados.",
                onConfirm: async () => {
                    openLoading("Creando categoría...");
                    try {
                        await handleCreateCategory(payload, images);
                        openSuccess("Categoría creada correctamente.");
                        resolve(true); // <- esto hará que CreateCategoryModal cierre
                    } catch (e) {
                        openError(e?.message);
                        reject(e); // <- esto NO cerrará (porque devolvimos false/throw)
                    }
                },
            });
        });
    }

    const handleUpdate = async (productId, payload, newImages, removedExistingImagesId) => {
        console.log("PRODUCT ID:", productId);
        console.log("PAYLOAD:", payload);
        console.log("NEW IMAGES:", newImages);
        console.log("REMOVED IMAGE IDS:", removedExistingImagesId);

        try {
            const update = await adminApi.updateProductById(productId, payload);

            if (!update || update.status !== "SUCCESS") {
                throw new Error(update?.message || "No se pudo actualizar el producto.");
            }

            // 2) eliminar imagenes (si hay)
            if (Array.isArray(removedExistingImagesId) && removedExistingImagesId.length > 0) {
                console.log("DELETE IMAGES IDS:", removedExistingImagesId);
                removedExistingImagesId.forEach(async (imgId) => {
                    await adminApi.deleteImageById(imgId);
                });
            }

            // 3) subir nuevas imágenes (si hay)
            if (Array.isArray(newImages) && newImages.length > 0) {
                const fd = new FormData();
                newImages.forEach((file) => fd.append("files", file));

                // OJO: esto debe coincidir con tu Controller (@RequestParam)
                fd.append("name", update?.data?.name ?? payload.name);

                // Si tu backend usa productId:
                fd.append("productId", String(productId));

                // Si tu backend usa product_id (como lo escribiste):
                // fd.append("product_id", String(productId));

                const imgRes = await adminApi.createProductImages(fd);

                if (!imgRes || imgRes.status !== "SUCCESS") {
                    throw new Error(imgRes?.message || "No se pudieron subir las imágenes.");
                }
            }

            // 3) refrescar lista para ver el nuevo (como ordenas desc por id, lo verás en la 1ra página)
            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.fetchProducts(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setProducts(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }
        } catch (e) {
            //setErrorText(e?.message || "Error actualizando producto.");
            throw e;
        }

        console.log("UPDATE PRODUCT");
    }

    const handleUpdateWithModals = async (productId, payload, newImages, removedExistingImagesId) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Guardar cambios?",
                message: "Se actualizará el producto y se aplicarán cambios de imágenes.",
                onConfirm: async () => {
                    openLoading("Actualizando producto...");
                    try {
                        await handleUpdate(productId, payload, newImages, removedExistingImagesId);
                        openSuccess("Producto actualizado correctamente.");
                        resolve(true);
                    } catch (e) {
                        openError(e?.message);
                        reject(e);
                    }
                },
            });
        });
    };

    const handleUpdateCategory = async (categoryId, payload, newImages, removedExistingImagesId) => {

        console.log("CATEGORY ID:", categoryId);
        console.log("PAYLOAD:", payload);
        console.log("NEW IMAGES:", newImages);
        console.log("REMOVED IMAGE IDS:", removedExistingImagesId);

        try {
            const update = await adminApi.updateCategoryById(categoryId, payload);

            if (!update || update.status !== "SUCCESS") {
                throw new Error(update?.message || "No se pudo actualizar la categoría.");
            }

            // 2) eliminar imagenes (si hay)
            if (Array.isArray(removedExistingImagesId) && removedExistingImagesId.length > 0) {
                await Promise.all(
                    removedExistingImagesId.map((imgId) => adminApi.deleteCategoryImageById(imgId))
                );
            }

            // 3) subir nuevas imágenes (si hay)
            if (Array.isArray(newImages) && newImages.length > 0) {
                const file = newImages[0];

                const fd = new FormData();
                fd.append("file", file);

                // OJO: esto debe coincidir con tu Controller (@RequestParam)
                fd.append("name", update?.data?.name ?? payload.name);

                // Si tu backend usa categoryId:
                fd.append("categoryId", String(categoryId));

                // Si tu backend usa product_id (como lo escribiste):
                // fd.append("product_id", String(productId));

                const imgRes = await adminApi.createCategoryImage(fd);

                if (!imgRes || imgRes.status !== "SUCCESS") {
                    throw new Error(imgRes?.message || "No se pudieron subir las imágenes.");
                }
            }

            // 3) refrescar lista para ver el nuevo (como ordenas desc por id, lo verás en la 1ra página)
            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.getCategoriesPaged(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setCategories(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }
        } catch (e) {
            //setErrorText(e?.message || "Error actualizando producto.");
            throw e;
        }
    }

    const handleUpdateCategoryWithModals = async (categoryId, payload, newImages, removedExistingImagesId) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Guardar cambios?",
                message: "Se actualizará la categoría y se aplicarán cambios de imágenes.",
                onConfirm: async () => {
                    openLoading("Actualizando categoría...");
                    try {
                        await handleUpdateCategory(categoryId, payload, newImages, removedExistingImagesId);
                        openSuccess("Categoría actualizada correctamente.");
                        resolve(true);
                    } catch (e) {
                        openError(e?.message);
                        reject(e);
                    }
                },
            });
        });
    }

    const handleDelete = async (productId) => {

        try {
            const delImg = await adminApi.deleteImagesUrlByProductId(productId);

            if (!delImg || delImg.status !== "SUCCESS") {
                throw new Error(delImg?.message || "No se pudieron eliminar las imágenes del producto.");
            }

            const delProd = await adminApi.deleteProductById(productId);

            if (!delProd || delProd.status !== "SUCCESS") {
                throw new Error(delProd?.message || "No se pudo eliminar el producto.");
            }

            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.fetchProducts(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setProducts([]);
                setTotalElements(0);
                setTotalPages(1);
                //setErrorText(res?.message || "No se pudo cargar productos.");
                return;
            }

            const d = res.data || {};
            setProducts(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));

        } catch (e) {
            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.fetchProducts(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setProducts([]);
                setTotalElements(0);
                setTotalPages(1);
                return;
            }

            const d = res.data || {};
            setProducts(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            throw e;
        }

    }

    const handleDeleteWithModals = (row) => {
        setDeleteId(row.id);

        openConfirm({
            title: "¿Eliminar producto?",
            message: `Se eliminará "${row.name}". Esta acción no se puede deshacer.`,
            onConfirm: async () => {
                openLoading("Eliminando producto...");
                try {
                    await handleDelete(row.id);
                    openSuccess("Producto eliminado correctamente.");
                } catch (e) {
                    openError("No se pudo eliminar el producto.");
                } finally {
                    setDeleteId(null);
                }
            },
        });
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const delImg = await adminApi.deleteCategoryImageByCategoryId(categoryId);

            if (!delImg || delImg.status !== "SUCCESS") {
                throw new Error(delImg?.message || "No se pudieron eliminar las imágenes de la categoría.");
            }

            const delProd = await adminApi.deleteCategoryById(categoryId);

            if (!delProd || delProd.status !== "SUCCESS") {
                throw new Error(delProd?.message || "No se pudo eliminar la categoría.");
            }

            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.getCategoriesPaged(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setCategories([]);
                setTotalElements(0);
                setTotalPages(1);
                //setErrorText(res?.message || "No se pudo cargar productos.");
                return;
            }

            const d = res.data || {};
            setCategories(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));

        } catch (e) {
            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.getCategoriesPaged(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setCategories([]);
                setTotalElements(0);
                setTotalPages(1);
                //setErrorText(res?.message || "No se pudo cargar productos.");
                return;
            }

            const d = res.data || {};
            setCategories(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));

        }
    }

    const handleDeleteCategoryWithModals = (row) => {
        setDeleteId(row.id);

        openConfirm({
            title: "¿Eliminar categoría?",
            message: `Se eliminará "${row.name}". Esta acción no se puede deshacer.`,
            onConfirm: async () => {
                openLoading("Eliminando categoría...");
                try {
                    await handleDeleteCategory(row.id);
                    openSuccess("Categoría eliminada correctamente.");
                } catch (e) {
                    openError("No se pudo eliminar la categoría.");
                } finally {
                    setDeleteId(null);
                }
            },
        });
    };

    const pillBtnSx = (active) => ({
        borderRadius: "14px",
        px: 2.2,
        py: 1.05,
        textTransform: "none",
        fontWeight: 300,
        gap: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "none",
        bgcolor: active ? "#501E14" : "#FFFFFF",
        color: active ? "#fff" : "#EFE4E2",
        border: "1px solid rgba(255,255,255,0.55)",
        "&:hover": {
            bgcolor: active ? "#501E14" : "#FFFFFF",
            boxShadow: "none",
        },
    });

    const addBtnSx = {
        borderRadius: "14px",
        px: 2.2,
        py: 1.05,
        fontSize: 15,
        textTransform: "none",
        fontWeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "none",
        bgcolor: "#4F6F64",
        "&:hover": { bgcolor: "#456258", boxShadow: "none" },
    };

    const cardSx = {
        borderRadius: "20px",
        bgcolor: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
        border: "1px solid rgba(255,255,255,0.65)",
    };

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    useEffect(() => {
        if (view !== "products") return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            setErrorText("");

            try {
                const apiPage = Math.max(0, page - 1);
                const res = await adminApi.fetchProducts(apiPage, pageSize, qDebounced);

                if (cancelled) return;

                if (!res || res.status !== "SUCCESS") {
                    setProducts([]);
                    setTotalElements(0);
                    setTotalPages(1);
                    //setErrorText(res?.message || "No se pudo cargar productos.");
                    return;
                }

                const d = res.data || {};
                setProducts(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            } catch (e) {
                if (cancelled) return;
                setProducts([]);
                setTotalElements(0);
                setTotalPages(1);
                //setErrorText("Error al cargar productos. Revisa consola / backend.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [view, page, pageSize, qDebounced]);

    useEffect(() => {
        if (view !== "categories") return;

        let cancelled = false;

        (async () => {
            setLoading(true);
            setErrorText("");

            try {
                const apiPage = Math.max(0, page - 1);
                const res = await adminApi.getCategoriesPaged(apiPage, pageSize, qDebounced);

                if (cancelled) return;

                if (!res || res.status !== "SUCCESS") {
                    setCategories([]);
                    setTotalElements(0);
                    setTotalPages(1);
                    //setErrorText(res?.message || "No se pudo cargar categorías.");
                    return;
                }

                const d = res.data || {};
                setCategories(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            } catch (e) {
                if (cancelled) return;
                setCategories([]);
                setTotalElements(0);
                setTotalPages(1);
                //setErrorText("Error al cargar categorías. Revisa consola / backend.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [view, page, pageSize, qDebounced]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages]);

    const money = useMemo(
        () =>
            new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
                maximumFractionDigits: 2,
            }),
        []
    );

    const onRowClick = (row) => {
        setViewId(row.id);
        setOpenView(true);
    };

    const headerCellSx = {
        fontWeight: 600,
        color: "#501E14",
        bgcolor: "#F7F1F0",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        fontSize: 13,
        whiteSpace: "nowrap",
    };

    const bodyCellSx = {
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        fontSize: 13.2,
        color: "rgba(0,0,0,0.70)",
    };

    const handleOpenView = (row) => {
        if (view === "products") {
            setViewId(row.id);
            setOpenView(true);
        } else {
            setCategoryViewId(row.id);
            setOpenCategoryView(true);
        }
    };

    const handleOpenCreate = () => {
        if (view === "products") {
            setOpenCreate(true);
        } else {
            setOpenCreateCategory(true);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 0,     // 👈 clave para que flex no “rompa” el scroll/alto
                display: "flex",
                flexDirection: "column",
            }}
        >

            <Box sx={{ display: "flex", gap: 2, mb: 2, px: 1, flexWrap: "wrap" }}>
                <Button
                    startIcon={<ShoppingBagOutlinedIcon />}
                    onClick={() => setView("products")}
                    sx={pillBtnSx(view === "products")}
                >
                    Productos
                </Button>

                <Button
                    startIcon={<CategoryOutlinedIcon />}
                    onClick={() => setView("categories")}
                    sx={pillBtnSx(view === "categories")}
                >
                    Categorías
                </Button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "stretch", sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                }}
            >
                <Typography sx={{ fontWeight: 500, px: 1, color: "#835A54", fontSize: 19, lineHeight: 1.2 }}>
                    {view === "products" ? "Lista de Productos" : "Lista de Categorías"}
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        ...addBtnSx,
                        alignSelf: { xs: "flex-end", sm: "center" }, // en móvil baja bonito
                    }}
                    onClick={handleOpenCreate}
                >
                    {view === "products" ? "Agregar Producto" : "Agregar Categoría"}
                </Button>
            </Box>

            <Paper
                sx={{
                    ...cardSx,
                    p: 2.5,
                    minHeight: 0,

                    display: "flex",
                    flexDirection: "column",

                    overflow: "hidden",
                    height: {
                        xs: "calc(100svh - 350px)",
                        sm: "calc(100dvh - 330px)",
                        lg: "calc(100dvh - 330px)"
                    },
                }}
            >
                {view !== "products" ? (
                    <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
                        <Box sx={{ height: "100%", width: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
                            {/* ✅ Search bar (pegada a la derecha) */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
                                <ActionModal
                                    open={loading}
                                    variant="loading"
                                    title="Cargando"
                                    message="Cargando categorías..."
                                    onClose={() => { }}
                                />
                                <TextField
                                    size="small"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Buscar categorias..."
                                    sx={{
                                        width: { xs: "100%", sm: 360 },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            bgcolor: "#FFFFFF",
                                            "& fieldset": { borderColor: "transparent" },
                                            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",

                                            "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.65)" },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchRoundedIcon sx={{ color: "rgba(80,30,20,0.45)" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: q ? (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setQ("")}
                                                    sx={{ color: "rgba(80,30,20,0.55)" }}
                                                >
                                                    <CloseRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                />
                            </Box>

                            <TableContainer
                                sx={{
                                    minHeight: 0,
                                    borderRadius: 3,
                                    overflow: "auto",
                                    bgcolor: "rgba(255,255,255,0.55)",
                                }}
                            >
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={headerCellSx}>Nombre</TableCell>
                                            <TableCell sx={{ ...headerCellSx, textAlign: "center" }} width={120}>
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>

                                        {!loading && !errorText && products.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ py: 3 }}>
                                                    <Typography sx={{ color: "rgba(75,31,22,0.65)", fontSize: 13 }}>
                                                        {qDebounced ? `Sin resultados para "${qDebounced}".` : "No hay productos para mostrar."}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {!loading &&
                                            !errorText &&
                                            categories.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    hover
                                                    onClick={() => handleOpenView(row)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        "&:hover": { bgcolor: "rgba(80,30,20,0.04)" },
                                                    }}
                                                >
                                                    <TableCell sx={bodyCellSx}>{row.name}</TableCell>
                                                    <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                                                        <Tooltip title="Editar">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditCategoryId(row.id);
                                                                    setOpenEditCategory(true);
                                                                }}
                                                                sx={{ mr: 0.5 }}
                                                            >
                                                                <EditOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Eliminar">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteCategoryWithModals(row);
                                                                }}
                                                            >
                                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
                        {/* ✅ Search bar (pegada a la derecha) */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
                            <ActionModal
                                open={loading}
                                variant="loading"
                                title="Cargando"
                                message="Cargando productos..."
                                onClose={() => { }}
                            />
                            <TextField
                                size="small"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Buscar productos..."
                                sx={{
                                    width: { xs: "100%", sm: 360 },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        bgcolor: "#FFFFFF",
                                        "& fieldset": { borderColor: "transparent" },
                                        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",

                                        "&.Mui-focused fieldset": { borderColor: "rgba(0,0,0,0.65)" },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon sx={{ color: "rgba(80,30,20,0.45)" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: q ? (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setQ("")}
                                                sx={{ color: "rgba(80,30,20,0.55)" }}
                                            >
                                                <CloseRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                }}
                            />
                        </Box>

                        <TableContainer
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                borderRadius: 3,
                                overflow: "auto",
                                bgcolor: "rgba(255,255,255,0.55)",
                            }}
                        >
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerCellSx}>Nombre</TableCell>
                                        <TableCell sx={headerCellSx}>Marca</TableCell>
                                        <TableCell sx={headerCellSx}>Categoría</TableCell>
                                        <TableCell sx={{ ...headerCellSx, textAlign: "right" }} width={120}>
                                            Precio
                                        </TableCell>
                                        <TableCell sx={{ ...headerCellSx, textAlign: "right" }} width={90}>
                                            Stock
                                        </TableCell>
                                        <TableCell sx={{ ...headerCellSx, textAlign: "center" }} width={120}>
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>

                                    {!loading && !errorText && products.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ py: 3 }}>
                                                <Typography sx={{ color: "rgba(75,31,22,0.65)", fontSize: 13 }}>
                                                    {qDebounced ? `Sin resultados para "${qDebounced}".` : "No hay productos para mostrar."}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!loading &&
                                        !errorText &&
                                        products.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                hover
                                                onClick={() => handleOpenView(row)}
                                                sx={{
                                                    cursor: "pointer",
                                                    "&:hover": { bgcolor: "rgba(80,30,20,0.04)" },
                                                }}
                                            >
                                                <TableCell sx={bodyCellSx}>{row.name}</TableCell>
                                                <TableCell sx={bodyCellSx}>{row.brand?.name || "-"}</TableCell>
                                                <TableCell sx={bodyCellSx}>{row.category?.name || "-"}</TableCell>
                                                <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                                                    {money.format(Number(row.price ?? 0))}
                                                </TableCell>
                                                <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                                                    {row.stock ?? 0}
                                                </TableCell>
                                                <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditId(row.id);
                                                                setOpenEdit(true);
                                                            }}
                                                            sx={{ mr: 0.5 }}
                                                        >
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteWithModals(row);
                                                            }}
                                                        >
                                                            <DeleteOutlineOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Paper>
            <CreateCategoryModal
                open={openCreateCategory}
                onClose={() => setOpenCreateCategory(false)}
                onSubmit={handleCreateCategoryWithModals}
            />
            <UpdateCategoryModal
                open={openEditCategory}
                onClose={() => setOpenEditCategory(false)}
                categoryId={editCategoryId}
                onSubmit={handleUpdateCategoryWithModals}
            />
            <ViewCategoryModal
                open={openCategoryView}
                categoryId={categoryViewId}
                onClose={() => {
                    setOpenCategoryView(false);
                    setCategoryViewId(null);
                }}
            />
            <CreateProductModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreateWithModals}
            />
            <UpdateProductModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                productId={editId}
                onSubmit={handleUpdateWithModals}
            />
            <ViewProductModal
                open={openView}
                productId={viewId}
                onClose={() => {
                    setOpenView(false);
                    setViewId(null);
                }}
            />
            <ActionModal
                open={uiModal.open}
                variant={uiModal.variant}
                title={uiModal.title}
                message={uiModal.message}
                onClose={closeUiModal}
                onConfirm={() => {
                    const fn = uiModal.onConfirm;
                    closeUiModal();
                    fn?.();
                }}
            />
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 2,
                    color: "rgba(75,31,22,0.65)",
                }}
            >
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    Página:
                </Typography>

                <Select
                    size="small"
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                    sx={{
                        minWidth: 72,
                        fontWeight: 500,
                        borderRadius: "14px",
                        bgcolor: "#FFFFFF",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                    }}
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <MenuItem key={p} value={p}>
                            {p}
                        </MenuItem>
                    ))}
                </Select>

                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {rangeText}
                </Typography>

                <IconButton onClick={handlePrev} disabled={page <= 1}>
                    <ChevronLeftIcon />
                </IconButton>

                <IconButton onClick={handleNext} disabled={page >= totalPages}>
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );


}