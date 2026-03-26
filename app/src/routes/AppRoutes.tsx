import { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import LoginPage from "@/pages/module/auth/Login"
import RequireAuth from "@/components/RequireAuth"
import { genMenuRoutes } from "@/routes/GenMenuRoutes"

const RoleCreatePage = lazy(() => import("@/pages/module/config/roles/create"))
const RoleEditPage = lazy(() => import("@/pages/module/config/roles/edit"))
const MenuCreatePage = lazy(() => import("@/pages/module/config/menus/create"))
const MenuEditPage = lazy(() => import("@/pages/module/config/menus/edit"))
const UserCreatePage = lazy(() => import("@/pages/module/config/users/create"))
const UserEditPage = lazy(() => import("@/pages/module/config/users/edit"))

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes - With Layout */}
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {genMenuRoutes.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                                <route.Component />
                            </Suspense>
                        }
                    />
                ))}
                <Route
                    path="/roles/create"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <RoleCreatePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/roles/:id/edit"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <RoleEditPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/menus/create"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <MenuCreatePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/menus/:id/edit"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <MenuEditPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/users/create"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <UserCreatePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/users/:id/edit"
                    element={
                        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading page...</div>}>
                            <UserEditPage />
                        </Suspense>
                    }
                />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
