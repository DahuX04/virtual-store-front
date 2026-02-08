import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Grid, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { getProductsPaged, getProductImageByProductId } from "../api/ProductsApi";

export default function ProductsCarousel() {

    const [products, setProducts] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const paged = await getProductsPaged({
                page: 0,
                size: 8,
                sortDir: "DESC",
            });

            if (!paged?.content) return;

            const withImages = await Promise.all(
                paged.content.map(async (p) => {
                    let imageUrl = null;
                    try {
                        const img = await getProductImageByProductId(p.id);
                        imageUrl =Array.isArray(img) ? img?.[0]?.url ?? null
                                                    : img?.url ?? null;
                    } catch {}

                    return {
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        imageUrl
                    };
                })
            );

            setProducts(withImages);

        } catch (err) {
            console.error(err);
        }
    }

    function scroll(direction) {
        if (!scrollRef.current) return;

        const scrollAmount = 300;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
    }

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>

            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4
            }}>
                <Typography variant="h5">
                    Productos
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
                >
                    Ver todo
                </Button>
            </Box>

            <Box sx={{ position: "relative", px: { xs: 4, sm: 6, md: 8 } }}>

                <IconButton
                    onClick={() => scroll("left")}
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Box
                    ref={scrollRef}
                    sx={{
                        display: "flex",
                        gap: 4,
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        "&::-webkit-scrollbar": { display: "none" }
                    }}
                >

                    {products.map(product => (
                        <Box
                            key={product.id}
                            sx={{
                                minWidth: 220,
                                flexShrink: 0
                            }}
                        >

                            <Box
                                component="img"
                                src={product.imageUrl || "/placeholder.png"}
                                alt={product.name}
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: 3,
                                    mb: 1
                                }}
                            />

                            <Typography sx={{
                                fontSize: 14,
                                color: "#2C2423"
                            }}>
                                {product.name}
                            </Typography>

                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                S/ {Number(product.price).toFixed(2)}
                            </Typography>

                        </Box>
                    ))}

                </Box>

                <IconButton
                    onClick={() => scroll("right")}
                    sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>

            </Box>

        </Container>
    );
}