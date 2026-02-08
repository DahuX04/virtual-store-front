import { Box, Button, Container, Typography } from "@mui/material";
import heroImage from "../../../assets/store/hero-section-store.png";

export default function HeroSection() {

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

                    <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
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
