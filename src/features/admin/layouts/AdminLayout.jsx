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
        <div className="relative min-h-screen bg-[#EFE4E2] overflow-hidden">
            {/* Fondo */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
                <div
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: "translate(-50%, -50%) scale(1.35)" }}
                >
                    <BackgroundVectorSvg height={1117} width={1728} color="#FBF8F7" />
                </div>
            </div>

            <div className="relative z-10 min-h-screen md:grid md:grid-cols-[308px_1fr]">
                <div className="hidden md:block">
                    <AdminSidebar
                        items={adminNavItems}
                        mobileOpen={mobileOpen}
                        onMobileClose={() => setMobileOpen(false)}
                        onLogout={handleLogout}
                    />
                </div>

                <div className="min-h-screen flex flex-col p-6 md:p-8">
                    <AdminNavbar
                        user={user}
                        onOpenSidebar={() => setMobileOpen(true)}
                        onLogout={handleLogout}
                    />

                    <Box sx={{ flex: 1, mt: 3 }}>
                        <Outlet />
                    </Box>
                </div>

                {/* Sidebar mobile (solo drawer) */}
                <div className="md:hidden">
                    <AdminSidebar
                        items={adminNavItems}
                        mobileOpen={mobileOpen}
                        onMobileClose={() => setMobileOpen(false)}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}
