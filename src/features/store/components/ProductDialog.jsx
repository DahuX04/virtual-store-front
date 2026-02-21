import { useEffect, useState } from "react";
import { Dialog, DialogContent, Box, Typography, IconButton, Button, Grid, CircularProgress, Chip, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getProductById, getProductImageByProductId } from "../api/ProductsApi";

export default function ProductDialog({ open, onClose, productId }) {
    const [fullProduct, setFullProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (open && productId) {
            setActiveStep(0);
            loadProductDetails();
        }
    }, [open, productId]);

    async function loadProductDetails() {
        setLoading(true);
        try {
            const [productData, imagesData] = await Promise.all([
                getProductById(productId),
                getProductImageByProductId(productId)
            ]);

            setFullProduct(productData);
            setImages(Array.isArray(imagesData) ? imagesData : (imagesData ? [imagesData] : []));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => setActiveStep((prev) => (prev + 1) % images.length);
    const handleBack = () => setActiveStep((prev) => (prev - 1 + images.length) % images.length);

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            keepMounted={false}
            PaperProps={{ 
                sx: { 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    margin: { xs: 2, md: 3 }
                } 
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{ 
                    position: "absolute", right: 12, top: 12, zIndex: 10, 
                    color: "#501E14", bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                    boxShadow: 2
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent sx={{ p: { xs: 3, md: 5 }, pt: { xs: 8, md: 6 }}}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '400px', gap: 2 }}>
                        <CircularProgress sx={{ color: "#501E14" }} />
                        <Typography variant="body2" color="text.secondary">Cargando detalles...</Typography>
                    </Box>
                ) : fullProduct ? (
                    <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center" justifyContent="center">
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                position: 'relative', 
                                width: '100%', 
                                maxWidth: { xs: '350px', sm: '450px', md: '100%' },
                                margin: '0 auto',
                                overflow: 'hidden', 
                                bgcolor: '#F9F7F6',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                            }}>
                                <Box
                                    component="img"
                                    src={images.length > 0 ? images[activeStep]?.url : 'https://via.placeholder.com/600x600?text=Sin+Imagen'}
                                    alt={fullProduct.name}
                                    sx={{ 
                                        width: "100%", 
                                        maxWidth: { xs: '350px', sm: '400px', md: '500px' },
                                        aspectRatio: "1/1", 
                                        objectFit: "cover", 
                                        borderRadius: 3,
                                    }}
                                />

                                {images.length > 1 && (
                                    <>
                                        <IconButton 
                                            onClick={handleBack}
                                            sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)', "&:hover": { bgcolor: "white" } }}
                                        >
                                            <ArrowBackIosNewIcon sx={{ fontSize: 20, color: "#501E14" }} />
                                        </IconButton>
                                        <IconButton 
                                            onClick={handleNext}
                                            sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)', "&:hover": { bgcolor: "white" } }}
                                        >
                                            <ArrowForwardIosIcon sx={{ fontSize: 20, color: "#501E14" }} />
                                        </IconButton>

                                        <Box sx={{ position: 'absolute', bottom: 16, width: '100%', display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                                            {images.map((_, index) => (
                                                <Box
                                                    key={index}
                                                    onClick={() => setActiveStep(index)}
                                                    sx={{ 
                                                        width: activeStep === index ? 24 : 8, 
                                                        height: 8, 
                                                        borderRadius: 4, 
                                                        bgcolor: activeStep === index ? '#501E14' : 'rgba(255,255,255,0.6)',
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography variant="overline" sx={{ color: "#A67C52", fontWeight: 800, letterSpacing: 2 }}>
                                    {fullProduct.brand?.name || 'Colección Exclusiva'}
                                </Typography>
                                
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 700, 
                                    color: "#2C2423", 
                                    mb: 1, 
                                    mt: 1,
                                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                                    lineHeight: 1.2
                                }}>
                                    {fullProduct.name}
                                </Typography>

                                <Typography variant="h4" sx={{ color: "#501E14", fontWeight: 500, mb: 3 }}>
                                    ${fullProduct.price?.toLocaleString()}
                                </Typography>

                                <Divider sx={{ mb: 3, mx: { xs: 'auto', md: 0 }, width: { xs: '80%', md: '100%' } }} />

                                <Typography variant="body1" sx={{ color: "#555", mb: 4, lineHeight: 1.7, textAlign: 'justify' }}>
                                    {fullProduct.description}
                                </Typography>

                                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1.5 }}>
                                    <Chip 
                                        label={fullProduct.stock > 0 ? `En Inventario: ${fullProduct.stock}` : "Agotado"} 
                                        sx={{ 
                                            bgcolor: fullProduct.stock > 0 ? "#E8F5E9" : "#FFEBEE",
                                            color: fullProduct.stock > 0 ? "#2E7D32" : "#C62828",
                                            fontWeight: 600,
                                            borderRadius: 1.5
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
                                        {fullProduct.category?.name}
                                    </Typography>
                                </Box>

                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    disabled={fullProduct.stock <= 0}
                                    sx={{ 
                                        backgroundColor: "#501E14", color: "white", 
                                        py: 2, borderRadius: 3,
                                        textTransform: "none", fontSize: "1.1rem", fontWeight: 600,
                                        "&:hover": { backgroundColor: "#3d170f", transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s ease',
                                        boxShadow: "0 6px 20px rgba(80, 30, 20, 0.3)"
                                    }}
                                >
                                    {fullProduct.stock > 0 ? "Añadir a mi carrito" : "Próximamente"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 10, width: '100%' }}>
                        <Typography variant="h6" color="text.secondary">Producto no encontrado</Typography>
                        <Button onClick={onClose} variant="outlined" sx={{ mt: 3, color: "#501E14", borderColor: "#501E14" }}>
                            Regresar a la tienda
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}