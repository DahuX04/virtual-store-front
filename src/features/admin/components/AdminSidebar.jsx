import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";

function SidebarContent({ items, onNavigate, onLogout }) {
    const location = useLocation();

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Logo / Header */}
            <Box
                sx={{
                    p: 3,
                    pb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="The Vanity"
                    sx={{
                        width: 100,
                        maxWidth: "100%",
                        height: "auto",
                        userSelect: "none",
                        pointerEvents: "none",
                        // opcional: si quieres un “aire” como tarjeta
                        // filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                    }}
                />
            </Box>

            {/* Nav Items */}
            <List sx={{ px: 4, pt: 1.5 }}>
                {items.map((it) => {
                    const Icon = it.icon;
                    const active = location.pathname === it.path;

                    return (
                        <ListItemButton
                            key={it.id}
                            onClick={() => onNavigate(it.path)}
                            sx={{
                                position: "relative",
                                borderRadius: 3,
                                mb: 0.8,
                                px: 2,
                                py: 1.15,


                                color: active ? "#835A54" : "#B0ABAA",

                                // barrita izquierda SOLO activo
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: -32,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: 7,
                                    height: 38,
                                    borderRadius: 0,
                                    bgcolor: active ? "#835A54" : "transparent",
                                    opacity: active ? 1 : 0,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={it.label}
                                primaryTypographyProps={{ fontSize: 15, fontWeight: active ? 720 : 500 }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            <Box sx={{ flex: 1 }} />

            {/* Logout */}
            <Box sx={{ px: 2, pb: 2 }}>
                <ListItemButton
                    onClick={onLogout}
                    sx={{
                        borderRadius: 3,
                        color: "rgba(75,31,22,0.70)",
                        "&:hover": { bgcolor: "rgba(80,30,20,0.08)" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                        <LogoutOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Cerrar Sesión"
                        primaryTypographyProps={{ fontSize: 18, fontWeight: 500 }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );
}

export default function AdminSidebar({
    items,
    mobileOpen,
    onMobileClose,
    drawerWidth = 260,
    onLogout,
}) {
    const navigate = useNavigate();

    const onNavigate = (path) => {
        navigate(path);
        onMobileClose?.();
    };

    const paperSx = {
        width: drawerWidth,
        borderRadius: 6,
        height: "calc(100vh - 60px)",
        mt: "32px",
        ml: "44px",
        bgcolor: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
        overflow: "hidden",
    };

    return (
        <>
            {/* Desktop */}
            <Paper
                elevation={0}
                sx={{
                    ...paperSx,
                    display: { xs: "none", md: "block" },
                }}
            >
                <SidebarContent items={items} onNavigate={onNavigate} onLogout={onLogout} />
            </Paper>

            {/* Mobile Drawer */}
            <Drawer
                open={mobileOpen}
                onClose={onMobileClose}
                variant="temporary"
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        bgcolor: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(10px)",
                    },
                }}
            >
                <SidebarContent items={items} onNavigate={onNavigate} onLogout={onLogout} />
            </Drawer>
        </>
    );
}
