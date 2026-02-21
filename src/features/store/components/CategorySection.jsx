import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCategoriesPaged, getCategoryImageByCategoryId } from "../api/CategoryApi";

export default function CategorySection() {

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        try {
            const paged = await getCategoriesPaged({
                page: 0,
                size: 4,
                sortDir: "DESC",
            });

            if (!paged?.content) return;

            const withImages = await Promise.all(
                paged.content.map(async (cat) => {
                    let imageUrl = null;

                    try {
                        const img = await getCategoryImageByCategoryId(cat.id);
                        imageUrl = img?.url || null;
                    } catch (e) {
                        console.error("IMG ERROR", e);
                    }

                    return {
                        id: cat.id,
                        name: cat.name,
                        imageUrl
                    };
                })
            );
            setCategories(withImages);

        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 30 }}><CircularProgress /></Box>;
    
    return (
        <Container maxWidth="xl" sx={{ py: 6, backgroundColor: "#f5f3f2" }}  > 
            <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4
                    }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: "#501E14" }}>
                    Categorías
                </Typography>

                <Button 
                    variant="text"
                    sx={{
                        color: "#2C2423",
                        textTransform: "none",
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                            backgroundColor: "transparent",
                            textDecoration: "underline"
                        }
                    }}
                    onClick={() => navigate("/store/categories")}
                >
                    Ver todo
                </Button>
            </Box>

            <Grid
                container
                spacing={3}
                justifyContent="space-between"
            >
                {categories.map(cat => (
                    <Grid
                        item xs={12} sm={6} md={6} lg={3} xl={3}
                        key={cat.id}
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >

                        <Box sx={{
                             width: {
                                xs: "100%",
                                sm: 320,
                                md: 220,
                                lg: 240,
                                xl: 260
                            },
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            color: "#2C2423",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-8px)", 
                            },
                            "&:hover img": {
                                transform: "scale(1.1)",
                            }
                        }}>

                            <Box
                                component="img"
                                src={cat.imageUrl}
                                alt={cat.name}
                                sx={{
                                    width: "100%",
                                    aspectRatio: "1 / 1",
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    mb: 2,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                    transition: "box-shadow 0.3s ease",
                                    "&:hover": {
                                        boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                                    }
                                }}
                            />

                            <Typography sx={{ mb: 1, fontWeight: 500 }}>
                                {cat.name}
                            </Typography>

                            <Button
                                variant="text"
                                sx={{
                                    color: "#2C2423",
                                    textTransform: "none",
                                    p: 0,
                                    minWidth: "auto",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        textDecoration: "underline"
                                    }
                                }}
                                onClick={() => navigate(`/store/categories/${cat.id}/products`)}
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