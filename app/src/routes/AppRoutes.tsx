import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import DashboardPage from "@/pages/general/Dashboard"
import LoginPage from "@/pages/auth/Login"
import RequireAuth from "@/components/RequireAuth"

// General
import ReportsPage from "@/pages/general/Reports"

// Sales
import LeadsPage from "@/pages/sales/leads"
import LeadCreatePage from "@/pages/sales/leads/create"
import ContactsPage from "@/pages/sales/contacts"
import ContactCreatePage from "@/pages/sales/contacts/create"
import AccountsPage from "@/pages/sales/accounts"
import AccountCreatePage from "@/pages/sales/accounts/create"
import DealsPage from "@/pages/sales/deals"
import DealCreatePage from "@/pages/sales/deals/create"
import DealDetailPage from "@/pages/sales/deals/detail"
import VisitsPage from "@/pages/sales/visits"
import VisitCreatePage from "@/pages/sales/visits/create"

// Transactions
import ProductsPage from "@/pages/transactions/products"
import ProductCreatePage from "@/pages/transactions/products/create"
import QuotesPage from "@/pages/transactions/Quotes"
import PurchaseOrdersPage from "@/pages/transactions/PurchaseOrders"

// Config
import RolesPage from "@/pages/config/Roles"
import RoleCreatePage from "@/pages/config/roles/create"
import UsersPage from "@/pages/config/Users"
import UserCreatePage from "@/pages/config/users/create"

// Profile
import MyAccountPage from "@/pages/profile/MyAccount"

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

                <Route path="/roles" element={<RolesPage />} />
                <Route path="/roles/create" element={<RoleCreatePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />

                    <Route path="/profile/my-account" element={<MyAccountPage />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
