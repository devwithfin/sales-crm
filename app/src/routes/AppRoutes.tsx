import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import DashboardPage from "@/pages/general/Dashboard"
import LoginPage from "@/pages/auth/Login"

// General
import ReportsPage from "@/pages/general/Reports"

// Sales
import LeadsPage from "@/pages/sales/leads"
import LeadCreatePage from "@/pages/sales/leads/create"
import ContactsPage from "@/pages/sales/contacts"
import DealsPage from "@/pages/sales/Deals"

// Activities
import TasksPage from "@/pages/activities/Tasks"
import VisitsPage from "@/pages/activities/Visits"

// Transactions
import ProductsPage from "@/pages/transactions/products"
import ProductCreatePage from "@/pages/transactions/products/create"
import QuotesPage from "@/pages/transactions/Quotes"
import PurchaseOrdersPage from "@/pages/transactions/PurchaseOrders"

// Config
import RolesPage from "@/pages/config/Roles"
import UsersPage from "@/pages/config/Users"

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes - With Layout */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/reports" element={<ReportsPage />} />

                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/leads/create" element={<LeadCreatePage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/deals" element={<DealsPage />} />

                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/visits" element={<VisitsPage />} />

                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/create" element={<ProductCreatePage />} />
                <Route path="/quotes" element={<QuotesPage />} />
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />

                <Route path="/roles" element={<RolesPage />} />
                <Route path="/users" element={<UsersPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}
