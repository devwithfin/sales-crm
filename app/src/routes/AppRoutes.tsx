import { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import DashboardPage from "@/pages/module/general/Dashboard"
import LoginPage from "@/pages/module/auth/Login"
import RequireAuth from "@/components/RequireAuth"
import { generatedMenuRoutes } from "@/routes/generated-menu-routes"

// General
import ReportsPage from "@/pages/module/general/Reports"

// Sales
import LeadsPage from "@/pages/module/sales/leads"
import LeadCreatePage from "@/pages/module/sales/leads/create"
import ContactsPage from "@/pages/module/sales/contacts"
import ContactCreatePage from "@/pages/module/sales/contacts/create"
import AccountsPage from "@/pages/module/sales/accounts"
import AccountCreatePage from "@/pages/module/sales/accounts/create"
import DealsPage from "@/pages/module/sales/deals"
import DealCreatePage from "@/pages/module/sales/deals/create"
import DealDetailPage from "@/pages/module/sales/deals/detail"
import VisitsPage from "@/pages/module/sales/visits"
import VisitCreatePage from "@/pages/module/sales/visits/create"

// Transactions
import ProductsPage from "@/pages/module/transactions/products"
import ProductCreatePage from "@/pages/module/transactions/products/create"
import QuotesPage from "@/pages/module/transactions/Quotes"
import PurchaseOrdersPage from "@/pages/module/transactions/PurchaseOrders"

// Config
import RolesPage from "@/pages/module/config/Roles"
import RoleCreatePage from "@/pages/module/config/roles/create"
import RoleEditPage from "@/pages/module/config/roles/edit"
import UsersPage from "@/pages/module/config/Users"
import UserCreatePage from "@/pages/module/config/users/create"
import MenusPage from "@/pages/module/config/Menus"
import PermissionsPage from "@/pages/module/config/Permissions"

// Profile
import MyAccountPage from "@/pages/module/profile/MyAccount"

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes - With Layout */}
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/reports" element={<ReportsPage />} />

                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/leads/create" element={<LeadCreatePage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/contacts/create" element={<ContactCreatePage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/accounts/create" element={<AccountCreatePage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/deals/create" element={<DealCreatePage />} />
                <Route path="/deals/:id" element={<DealDetailPage />} />
                <Route path="/visits" element={<VisitsPage />} />
                <Route path="/visits/create" element={<VisitCreatePage />} />

                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/create" element={<ProductCreatePage />} />
                <Route path="/quotes" element={<QuotesPage />} />
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />

                <Route path="/menus" element={<MenusPage />} />
                <Route path="/permissions" element={<PermissionsPage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/roles/create" element={<RoleCreatePage />} />
                <Route path="/roles/:id/edit" element={<RoleEditPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />

                {generatedMenuRoutes.map(route => (
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
                    <Route path="/profile/my-account" element={<MyAccountPage />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
