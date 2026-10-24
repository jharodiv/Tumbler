import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/auth/LoginPage";
import ProtectedRoute from "@/auth/ProtectedRoute";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import AssetsPage from "@/pages/assets/AssetsPage";
import AssetDetailPage from "@/pages/assets/AssetDetailPage";
import AssetFormPage from "@/pages/assets/AssetFormPage";
import AssignmentsPage from "@/pages/assignments/AssignmentsPage";
import UsersPage from "@/pages/users/UsersPage";
import UserDetailPage from "@/pages/users/UserDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import { ROUTES } from "@/routes";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.login} element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path={ROUTES.assets} element={<AssetsPage />} />
                        <Route path={ROUTES.newAsset} element={<AssetFormPage />} />
                        <Route path={ROUTES.asset} element={<AssetDetailPage />} />
                        <Route path={ROUTES.editAsset} element={<AssetFormPage />} />
                        <Route path={ROUTES.assignments} element={<AssignmentsPage />} />
                        <Route path={ROUTES.users} element={<UsersPage />} />
                        <Route path={ROUTES.user} element={<UserDetailPage />} />
                        <Route path={ROUTES.categories} element={<CategoriesPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
            </Routes>
        </BrowserRouter>
    );
}
