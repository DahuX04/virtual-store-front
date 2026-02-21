import { Box, Button, Container, Typography } from "@mui/material";
import heroImage from "../../../assets/store/hero-section-store.png";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", minHeight: 400 }}>
            <Box sx={{
                flex: 1,
                backgroundColor: "#6d1f14",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        Colecciones únicas,
                        pensadas para ti
                    </Typography>

                    <Typography sx={{ mb: 3 }}>
                        Compra online piezas pensadas para acompañarte en cada momento.
                    </Typography>

                    <Button variant="outlined" 
                        sx={{ 
                            color: "white", 
                            borderColor: "white",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "white",
                                color: "#501E14",
                                borderColor: "white",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 15px rgba(255,255,255,0.2)"
                            }
                        }}
                        onClick={() => navigate("/store/products")}>
                        Ver productos
                    </Button>
                </Container>
            </Box>

            <Box sx={{
                flex: 1,
                component: "img",
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }} />
        </Box>
    );
}
