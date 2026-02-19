import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import AdminView from "../../features/admin/pages/AdminView";
import RequireRole from "../../shared/router/RequireRole";
import AdminLayout from "../../features/admin/layouts/AdminLayout";
import AdminViewDashboard from "../../features/admin/pages/AdminViewDashboard";
import AdminViewProducts from "../../features/admin/pages/AdminViewProducts";
import AdminViewBrands from "../../features/admin/pages/AdminViewBrands";
import StoreHome from "../../features/store/pages/StoreHome";
import CategoriesPage from "../../features/store/pages/CategoriesPage";
import ProductsPage from "../../features/store/pages/ProductsPage";
import ProductsByCategoryPage from "../../features/store/pages/ProductsByCategoryPage";
import AdminViewSells from "../../features/admin/pages/AdminViewSells";

function Forbidden() {
    return <div className="p-10">No autorizado</div>;
}

export default function AppRouter() {

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}>
            </Route>
            <Route path="/store">
                <Route index element={<StoreHome />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:id/products" element={<ProductsByCategoryPage />} />
            </Route>
            <Route path="/forbidden" element={<Forbidden />} />
            

            <Route element={<RequireRole role="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminView />} />
                    <Route path="dashboard" element={<AdminViewDashboard />} />
                    {<Route path="productos" element={<AdminViewProducts />} />}
                    {<Route path="marcas" element={<AdminViewBrands />} />}
                    {<Route path="ventas" element={<AdminViewSells />} />}
                </Route>
            </Route>
        </Routes>
    );

}