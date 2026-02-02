import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import adminApi from "../api/AdminApi";
import ActionModal from "../components/ActionModal";

// Si ya tienes estos modales, descomenta e intégralos.
import CreateBrandModal from "../components/CreateBrandModal";
import UpdateBrandModal from "../components/UpdateBrandModal";
import ViewBrandModal from "../components/ViewBrandModal";

export default function AdminViewBrands() {
    const pageSize = 10;

    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [deleteId, setDeleteId] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [viewId, setViewId] = useState(null);

    const [page, setPage] = useState(1);
    const [brands, setBrands] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [q, setQ] = useState("");
    const [qDebounced, setQDebounced] = useState("");

    const [uiModal, setUiModal] = useState({
        open: false,
        variant: "loading",
        title: "",
        message: "",
        onConfirm: null,
    });

    const closeUiModal = () =>
        setUiModal((s) => ({ ...s, open: false, onConfirm: null }));

    const openLoading = (message = "Procesando...") =>
        setUiModal({
            open: true,
            variant: "loading",
            title: "Procesando",
            message,
            onConfirm: null,
        });

    const openError = (message = "Se produjo un error al procesar la solicitud") =>
        setUiModal({
            open: true,
            variant: "error",
            title: "Ha ocurrido un error",
            message,
            onConfirm: null,
        });

    const openSuccess = (message = "Operación realizada correctamente") =>
        setUiModal({
            open: true,
            variant: "success",
            title: "Mensaje de éxito",
            message,
            onConfirm: null,
        });

    const openConfirm = ({ title, message, onConfirm }) =>
        setUiModal({ open: true, variant: "confirm", title, message, onConfirm });

    // Debounce (igual que tu estándar)
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

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    // Fetch Brands paged
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setErrorText("");

            try {
                const apiPage = Math.max(0, page - 1);

                // ✅ Ajusta el nombre si tu adminApi usa otro método
                const res = await adminApi.getBrandsPaged(apiPage, pageSize, qDebounced);

                if (cancelled) return;

                if (!res || res.status !== "SUCCESS") {
                    setBrands([]);
                    setTotalElements(0);
                    setTotalPages(1);
                    return;
                }

                const d = res.data || {};
                setBrands(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            } catch (e) {
                if (cancelled) return;
                setBrands([]);
                setTotalElements(0);
                setTotalPages(1);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [page, pageSize, qDebounced]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages]);

    // --- estilos (copiados de tu estándar) ---
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

    // --- handlers CRUD (si ya tienes modales, los usas) ---
    const refreshFirstPage = async () => {
        setPage(1);
        const res = await adminApi.getBrandsPaged(0, pageSize, qDebounced);
        if (res?.status === "SUCCESS") {
            const d = res.data || {};
            setBrands(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
        }
    };

    const handleDeleteBrand = async (brandId) => {
        try {
            const del = await adminApi.deleteBrandById(brandId);

            if (!del || del.status !== "SUCCESS") {
                throw new Error(del?.message || "No se pudo eliminar la marca.");
            }
            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.getBrandsPaged(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setBrands([]);
                setTotalElements(0);
                setTotalPages(1);
                return;
            }

            const d = res.data || {};
            setBrands(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
        } catch (e) {
            const apiPage = Math.max(0, page - 1);
            const res = await adminApi.getBrandsPaged(apiPage, pageSize, qDebounced);

            if (!res || res.status !== "SUCCESS") {
                setBrands([]);
                setTotalElements(0);
                setTotalPages(1);
                return;
            }

            const d = res.data || {};
            setBrands(Array.isArray(d.content) ? d.content : []);
            setTotalElements(Number(d.totalElements ?? 0));
            setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            console.log("ERROR: ", e)
            throw e;
        }

    };

    const handleDeleteBrandWithModals = (row) => {
        setDeleteId(row.id);

        openConfirm({
            title: "¿Eliminar marca?",
            message: `Se eliminará "${row.name}". Esta acción no se puede deshacer.`,
            onConfirm: async () => {
                openLoading("Eliminando marca...");
                try {
                    await handleDeleteBrand(row.id);
                    openSuccess("Marca eliminada correctamente.");
                } catch (e) {
                    openError(e?.message || "No se pudo eliminar la marca.");
                } finally {
                    setDeleteId(null);
                }
            },
        });
    };

    const handleCreateBrand = async (payload) => {

        try {
            const created = await adminApi.createBrand(payload);

            if (!created || created.status !== "SUCCESS") {
                throw new Error(created?.message || "No se pudo crear la marca.");
            }

            const brandId = created?.data?.id;
            if (!brandId) {
                throw new Error("El backend no devolvió el id de la marca creada.");
            }

            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.getBrandsPaged(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setBrands(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }

        } catch (e) {
            //setErrorText(e?.message || "Error creando categoría.");
            throw e;
        }


    };

    const handleCreateBrandWithModals = async (payload) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Crear marca?",
                message: "Se creará la marca con los datos ingresados.",
                onConfirm: async () => {
                    openLoading("Creando marca...");
                    try {
                        await handleCreateBrand(payload);
                        openSuccess("Marca creada correctamente.");
                        resolve(true); // <- esto hará que CreateCategoryModal cierre
                    } catch (e) {
                        openError(e?.message);
                        reject(e); // <- esto NO cerrará (porque devolvimos false/throw)
                    }
                },
            });
        });
    }

    const handleEditBrand = async (brandId, payload) => {
        try {
            const update = await adminApi.updateBrandById(brandId, payload);

            if (!update || update.status !== "SUCCESS") {
                throw new Error(update?.message || "No se pudo actualizar la marca.");
            }

            setPage(1);
            // si ya estás en page 1, setPage(1) no re-dispara siempre; fuerza refresh:
            const res = await adminApi.getBrandsPaged(0, pageSize);
            if (res?.status === "SUCCESS") {
                const d = res.data || {};
                setBrands(Array.isArray(d.content) ? d.content : []);
                setTotalElements(Number(d.totalElements ?? 0));
                setTotalPages(Math.max(1, Number(d.totalPages ?? 1)));
            }
        } catch (e) {
            //setErrorText(e?.message || "Error actualizando producto.");
            throw e;
        }
    }

    const handleUpdateCategoryWithModals = async (brandId, payload) => {
        return await new Promise((resolve, reject) => {
            openConfirm({
                title: "¿Guardar cambios?",
                message: "Se actualizará la marca.",
                onConfirm: async () => {
                    openLoading("Actualizando marca...");
                    try {
                        await handleEditBrand(brandId, payload);
                        openSuccess("Marca actualizada correctamente.");
                        resolve(true);
                    } catch (e) {
                        openError(e?.message);
                        reject(e);
                    }
                },
            });
        });
    }

    const onRowClick = (row) => {
        setViewId(row.id);
        setOpenView(true);
    };

    return (
        <Box
            sx={{
                width: "100%",
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header: título + botón */}
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
                <Typography
                    sx={{
                        fontWeight: 500,
                        px: 1,
                        color: "#835A54",
                        fontSize: 19,
                        lineHeight: 1.2,
                    }}
                >
                    Lista de Marcas
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ ...addBtnSx, alignSelf: { xs: "flex-end", sm: "center" } }}
                    onClick={() => setOpenCreate(true)}
                >
                    Agregar Marca
                </Button>
            </Box>

            {/* Card */}
            <Paper
                sx={{
                    ...cardSx,
                    p: 2.5,
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Search bar derecha */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
                    <ActionModal
                        open={loading}
                        variant="loading"
                        title="Cargando"
                        message="Cargando marcas..."
                        onClose={() => { }}
                    />

                    <TextField
                        size="small"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar marcas..."
                        sx={{
                            width: { xs: "100%", sm: 360 },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                bgcolor: "#FFFFFF",
                                "& fieldset": { borderColor: "transparent" },
                                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                                "&.Mui-focused fieldset": {
                                    borderColor: "rgba(0,0,0,0.65)",
                                },
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

                {/* Tabla scrolleable */}
                <TableContainer
                    sx={{
                        flex: "1 1 0",
                        minHeight: 0,
                        borderRadius: 3,
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                        bgcolor: "rgba(255,255,255,0.55)",
                    }}
                >
                    <Table stickyHeader size="small" sx={{ minWidth: 420 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headerCellSx}>Nombre</TableCell>
                                <TableCell sx={headerCellSx}>Descripcion</TableCell>
                                <TableCell sx={{ ...headerCellSx, textAlign: "center" }} width={120}>
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {!loading && !errorText && brands.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ py: 3 }}>
                                        <Typography sx={{ color: "rgba(75,31,22,0.65)", fontSize: 13 }}>
                                            {qDebounced
                                                ? `Sin resultados para "${qDebounced}".`
                                                : "No hay marcas para mostrar."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                !errorText &&
                                brands.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        onClick={() => onRowClick(row)}
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: "rgba(80,30,20,0.04)" },
                                        }}
                                    >
                                        <TableCell sx={bodyCellSx}>{row.name}</TableCell>
                                        <TableCell sx={bodyCellSx}>{row.description}</TableCell>
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
                                                    onClick={() => handleDeleteBrandWithModals(row)}
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
            </Paper>

            {/* Paginación abajo (igual que tu estándar) */}
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
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Página:</Typography>

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

                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{rangeText}</Typography>

                <IconButton onClick={handlePrev} disabled={page <= 1}>
                    <ChevronLeftIcon />
                </IconButton>

                <IconButton onClick={handleNext} disabled={page >= totalPages}>
                    <ChevronRightIcon />
                </IconButton>

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
                <CreateBrandModal
                    open={openCreate}
                    onClose={() => setOpenCreate(false)}
                    onSubmit={handleCreateBrandWithModals}
                />
                <UpdateBrandModal
                    open={openEdit}
                    brandId={editId}
                    onClose={() => { setOpenEdit(false); setEditId(null); }}
                    onSubmit={handleUpdateCategoryWithModals}
                />
                <ViewBrandModal
                    open={openView}
                    brandId={viewId}
                    onClose={() => {
                        setOpenView(false);
                        setViewId(null);
                    }}
                />
            </Box>


        </Box>
    );
}
