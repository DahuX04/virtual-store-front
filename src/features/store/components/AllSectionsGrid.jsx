import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { getCategoriesPaged, getCategoryImageByCategoryId } from "../api/CategoryApi";
import { getProductByCategory, getProductImageByProductId, getProductsPaged } from "../api/ProductsApi";
import { useNavigate, useParams } from "react-router-dom";

export default function AllSectionsGrid({ title, type = "categories" }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (type === "categories") {
            loadAllCategories();
        } else if (type === "productsByCategory") {
            loadProductsByCat(); 
        } else if (type === "products") {
            loadAllProducts();
        }
    }, [id, type])

    async function loadAllCategories() {
        setLoading(true);
        try {
            const paged = await getCategoriesPaged({ page: 0, size: 50, sortDir: "DESC" });
            if (!paged?.content) return;

            const data = await Promise.all(
                paged.content.map(async (cat) => {
                    const img = await getCategoryImageByCategoryId(cat.id);
                    return { 
                        id: cat.id, 
                        name: cat.name, 
                        imageUrl: img?.url || null,
                        link: `/store/categories/${cat.id}/products` 
                    };
                })
            );
            setItems(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    async function loadProductsByCat() {
        setLoading(true);
        try {
            const paged = await getProductByCategory(id, { page: 0, size: 50, sortDir: "DESC" });
            if (!paged?.content) {
                setItems([]);
                setLoading(false);
                return;
            }

            const data = await Promise.all(
                paged.content.map(async (prod) => {
                    let imageUrl = null;
                    try {
                        const img = await getProductImageByProductId(prod.id);
                        imageUrl = Array.isArray(img) 
                            ? img?.[0]?.url ?? null 
                            : img?.url ?? null;
                    } catch (e) {
                        console.error("Error cargando imagen de producto:", e);
                    }

                    return { 
                        id: prod.id, 
                        name: prod.name, 
                        price: prod.price,
                        imageUrl,
                        link: `/store` 
                    };
                })
            );
            setItems(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    async function loadAllProducts() {
        setLoading(true);
        try {
            const paged = await getProductsPaged({ page: 0, size: 50, sortDir: "DESC" });
            if (!paged?.content) {
                setItems([]);
                setLoading(false);
                return;
            }
            const data = await Promise.all(
                paged.content.map(async (prod) => {
                    let imageUrl = null;
                    try {
                        const img = await getProductImageByProductId(prod.id);
                        imageUrl = Array.isArray(img)
                            ? img?.[0]?.url ?? null
                            : img?.url ?? null;
                    }
                    catch {
                    }
                    return {
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        imageUrl,
                        link: `/store`
                    };
                })
            );
            setItems(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 40 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl" sx={{ py: 6, backgroundColor: "#f5f3f2" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: "#501E14" }}>
                    {title}
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="space-around">
                {items.map(item => (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={item.id} sx={{ display: "flex", justifyContent: "center" }}>
                        <Box sx={{ width: { xs: 400, sm: 320, md: 220, lg: 240 }, display: "flex", flexDirection: "column", color: "#2C2423" }}>
                            <Box
                                component="img"
                                src={item.imageUrl || 'https://via.placeholder.com/300'} 
                                alt={item.name}
                                sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2, mb: 2 }}
                            />
                            <Typography sx={{ mb: 0.5, fontWeight: 500 }}>
                                {item.name}
                            </Typography>
                            
                            {item.price && (
                                <Typography sx={{ mb: 1, color: "#501E14", fontWeight: 700 }}>
                                    ${item.price}
                                </Typography>
                            )}

                            <Button
                                variant="text"
                                onClick={() => navigate(item.link)}
                                sx={{ color: "#2C2423", textTransform: "none", p: 0, minWidth: "auto", alignSelf: "flex-start", "&:hover": { textDecoration: "underline", backgroundColor: "transparent" } }}
                            >
                                Ver más
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}