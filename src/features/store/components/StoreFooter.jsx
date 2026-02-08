import { Box, Container, Grid, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaTiktok } from "react-icons/fa";

import logo from "../../../assets/logo2.svg";

export default function StoreFooter() {
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

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FacebookIcon sx={{ cursor: "pointer" }} />
                                <InstagramIcon sx={{ cursor: "pointer" }} />
                                <FaTiktok size={22} style={{ cursor: "pointer" }} />
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

                                <Typography sx={{ opacity: 0.8, cursor: "pointer" }}>
                                    Ver productos
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                    COMPRAS
                                </Typography>

                                <Typography sx={{ opacity: 0.8, cursor: "pointer", mb: 1 }}>
                                    Mi cuenta
                                </Typography>

                                <Typography sx={{ opacity: 0.8, cursor: "pointer" }}>
                                    Mis pedidos
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                    CONTACTO
                                </Typography>

                                <Typography sx={{ opacity: 0.8, cursor: "pointer" }}>
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