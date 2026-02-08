import { Box, Container} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Link } from "react-router-dom";

import logo from "../../../assets/logo.svg";

export default function StoreHeader() {

    return (
        <Box sx={{ backgroundColor: "#f5f3f2", py: 2, color: "#501E14" }}>
            <Container sx={{
                display: "flex",
                alignItems: "center"
            }}>

                <Box sx={{ flex: 1 }}>
                    <MenuIcon sx={{ cursor: "pointer" }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/store">
                        <Box
                            component="img"
                            src={logo}
                            alt="The Vanity"
                            sx={{ height: 70 }}
                        />
                    </Link>
                </Box>

                <Box sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2
                }}>
                    <Link
                        to="/login"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            Iniciar Sesión
                        </Box>
                    </Link>

                    <Link to="/login" style={{ color: "inherit" }}>
                        <PersonOutlineIcon sx={{ display: { xs: "block", sm: "none" } }} />
                    </Link>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ShoppingCartOutlinedIcon />
                        (0)
                    </Box>
                </Box>

            </Container>
        </Box>
    );
}