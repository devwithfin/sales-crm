import { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import LoginPage from "@/pages/module/auth/Login"
import RequireAuth from "@/components/RequireAuth"
import { genMenuRoutes } from "@/routes/GenMenuRoutes"

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
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
