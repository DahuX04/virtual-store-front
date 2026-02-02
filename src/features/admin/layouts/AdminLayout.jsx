import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import BackgroundVectorSvg from "../../../assets/svg/background-vector";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import adminNavItems from "../config/adminNavItems";

import AuthStorage from "../../../shared/auth/authStorage";
import adminApi from "../api/AdminApi";

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Traer datos del usuario desde API (token ya lo manda tu interceptor)
    useEffect(() => {
        let alive = true;

        async function loadMe() {
            const userId = AuthStorage.getUserId();
            if (!userId) {
                setUser(null);
                return;
            }

            const res = await adminApi.fetchAdminData(userId);

            if (!alive) return;

            const userRaw = res.data;
            console.log("Admin data (processed):", userRaw);
            setUser({
                id: userRaw.id,
                name: userRaw.name,
                lastName: userRaw.lastName,
            });

        }

        loadMe();
        return () => {
            alive = false;
        };
    }, []);

    const handleLogout = () => {
        AuthStorage.clear();
        window.location.href = "/login";
    };

    return (
        <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "#EFE4E2", overflow: "hidden" }}>
            {/* Fondo */}
            <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.25 }}>
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%) scale(1.35)",
                    }}
                >
                    <BackgroundVectorSvg height={1117} width={1728} color="#FBF8F7" />
                </Box>
            </Box>

            {/* Layout */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100vh",
                    display: { xs: "block", md: "grid" }, // MUI md = 900px
                    gridTemplateColumns: { md: "308px 1fr" },
                }}
            >
                {/* Sidebar (el mismo componente ya maneja Paper (md+) y Drawer (xs)) */}
                <Box sx={{ minHeight: 0 }}>
                    <AdminSidebar
                        items={adminNavItems}
                        mobileOpen={mobileOpen}
                        onMobileClose={() => setMobileOpen(false)}
                        onLogout={handleLogout}
                    />
                </Box>

                {/* Main */}
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        p: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    <AdminNavbar
                        user={user}
                        onOpenSidebar={() => setMobileOpen(true)}
                        onLogout={handleLogout}
                    />

                    <Box sx={{ flex: 1, mt: 3, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
