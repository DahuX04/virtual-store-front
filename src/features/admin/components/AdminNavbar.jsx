import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function AdminNavbar({ user, onOpenSidebar, onLogout }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fullName = user ? `${user.name ?? ""} ${user.lastName ?? ""}`.trim() : "Cargando...";
    const roleLabel = user?.roleLabel ?? "Administrador";

    return (
        <Paper
            elevation={0}
            sx={{
                height: 64,
                px: 2,
                borderRadius: 5,
                bgcolor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                <IconButton
                    onClick={onOpenSidebar}
                    sx={{ display: { xs: "inline-flex", md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, ml: 2 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: "#4B1F16" }}>
                    {fullName?.[0]?.toUpperCase() ?? "A"}
                </Avatar>

                <Box sx={{ lineHeight: 1.1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#2A1A18" }}>
                        {fullName}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(42,26,24,0.55)" }}>
                        {roleLabel}
                    </Typography>
                </Box>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <KeyboardArrowDownIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            onLogout?.();
                        }}
                    >
                        Cerrar Sesión
                    </MenuItem>
                </Menu>
            </Box>
        </Paper>
    );
}
