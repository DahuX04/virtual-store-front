import loginImage from "../../../assets/login/login-image.svg";
import BackgroundVectorSvg from "../../../assets/svg/background-vector";
import { useMemo, React, useState } from "react";
import AppTextField from "../../../shared/components/AppTextField";
import AppPasswordField from "../../../shared/components/AppPasswordField";
import AppPrimaryButton from "../../../shared/components/AppPrimaryButton";
import authApi from "../api/AuthApi";
import { useNavigate } from "react-router-dom";
import AuthStorage from "../../../shared/auth/authStorage";

export default function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailError = useMemo(() => {
        if (!touched.email) return "";
        if (!email.trim()) return "El correo es requerido";
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!ok) return "Correo inválido";
        return "";
    }, [email, touched.email]);

    const passwordError = useMemo(() => {
        if (!touched.password) return "";
        if (!password.trim()) return "La contraseña es requerida";
        return "";
    }, [password, touched.password]);

    const canSubmit = !emailError && !passwordError && email.trim() && password.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (!canSubmit) return;

        const data = await authApi.login({ email: email.trim(), password: password.trim() });
        const payload = data.data;
        const role = payload?.Role;
        const userId = payload?.id;
        const token = payload?.token;
        
        AuthStorage.setSession({ token, role, userId });

        if (role === "ADMIN") navigate("/admin", { replace: true });
        else navigate("/app", { replace: true });

    };

    return (
        <div className="min-h-screen md:h-screen md:grid md:grid-cols-[auto_1fr] bg-[#501E14]">
            <div className="hidden md:block h-screen">
                <img
                    src={loginImage}
                    alt="Login visual"
                    className="h-full w-auto object-contain"
                />
            </div>

            <div className="relative min-h-screen md:h-screen overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.35] sm:scale-[1.15] md:scale-100">
                        <BackgroundVectorSvg height={982} width={1512} color={"#835A54"} />
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="relative z-10 w-full max-w-md px-6 sm:px-8 py-10 flex flex-col gap-6"
                >
                    <div className="text-white text-4xl sm:text-5xl font-semibold text-center">
                        Inicia Sesión
                    </div>

                    <AppTextField
                        label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                        placeholder="user@example.com"
                        error={!!emailError}
                        helperText={emailError || " "}
                        inputProps={{ autoComplete: "email" }}
                    />

                    <AppPasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                        showPassword={showPassword}
                        onToggleShowPassword={() => setShowPassword((v) => !v)}
                        error={!!passwordError}
                        helperText={passwordError || " "}
                    />

                    <AppPrimaryButton type="submit" disabled={!canSubmit} sx={{ mt: 1 }}>
                        Iniciar Sesión
                    </AppPrimaryButton>
                </form>
            </div>
        </div>
    );
}