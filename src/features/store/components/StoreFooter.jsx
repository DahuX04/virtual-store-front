import { Box, Container, Grid, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../../../assets/logo2.svg";

export default function StoreFooter() {
    const navigate = useNavigate();

return (
        <Box sx={{ backgroundColor: "#2c1f1a", color: "white", pt: 6, pb: 3 }}>

            <Container>
                <Grid container spacing={4}
                    justifyContent={{
                        xs: "center",
                        md: "space-between"
                    }}
                    textAlign={{
                        xs: "center",
                        md: "left"
                    }}
                >
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>

                            <Box
                                component="img"
                                src={logo}
                                alt="The Vanity"
                                sx={{ height: 60, width: "fit-content" }}
                            />

                            <Box sx={{ 
                                display: "flex", 
                                gap: 2,
                                "& svg": {
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    opacity: 0.8,
                                    "&:hover": {
                                        opacity: 1,
                                        transform: "scale(1.2) translateY(-3px)",
                                        color: "#A67C52",
                                        filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))"
                                    }
                                }
                            }}>
                                <FacebookIcon />
                                <InstagramIcon />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FaTiktok size={22} />
                                </Box>
                            </Box>

                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4} 
                            sx={{
                            display: "flex",
                            justifyContent: {
                                xs: "center",     
                                md: "flex-end"
                            }
                        }}>
                            <Grid item xs={12} sm={4}>
                                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                    TIENDA
                                </Typography>

                                <Typography 
                                    onClick={() => navigate("/store/products")}
                                    sx={{ 
                                        opacity: 0.7, 
                                        cursor: "pointer", 
                                        transition: "all 0.2s ease",
                                        "&:hover": { opacity: 1, transform: "translateX(4px)", color: "white" } 
                                    }}
                                >
                                    Ver productos
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                    COMPRAS
                                </Typography>

                                <Typography sx={{ 
                                    opacity: 0.7, 
                                    cursor: "pointer", 
                                    mb: 1, 
                                    transition: "all 0.2s ease",
                                    "&:hover": { opacity: 1, transform: "translateX(4px)" } 
                                }}>
                                    Mi cuenta
                                </Typography>

                                <Typography sx={{ 
                                    opacity: 0.7, 
                                    cursor: "pointer", 
                                    transition: "all 0.2s ease",
                                    "&:hover": { opacity: 1, transform: "translateX(4px)" } 
                                }}>
                                    Mis pedidos
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                    CONTACTO
                                </Typography>

                                <Typography sx={{ 
                                    opacity: 0.7, 
                                    cursor: "pointer", 
                                    transition: "all 0.2s ease",
                                    "&:hover": { opacity: 1, transform: "translateX(4px)" } 
                                }}>
                                    Contáctanos
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>

                <Box sx={{
                    textAlign: "center",
                    mt: 6,
                    pt: 3,
                    borderTop: "1px solid rgba(255,255,255,0.2)"
                }}>
                    <Typography sx={{ opacity: 0.7 }}>
                        © 2026 The Vanity
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
}