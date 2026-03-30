import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth"

interface RequireAuthProps {
    allowedRoles?: string[]
}

/**
 * RequireAuth component protects routes based on authentication state
 * and optionally based on user role.
 */
export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    // Show nothing while we're figuring out our authentication state
    if (isLoading) {
        return <div className="p-6 text-sm text-slate-500">Loading auth state...</div>
    }

    // Unauthenticated: Redirect to login with current location as state
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Unauthorized: If roles are specified, check if user matches
    if (allowedRoles && user.role) {
        const isAuthorized = allowedRoles.some(
            role => role.toLowerCase() === user.role.name.toLowerCase()
        )
        
        if (!isAuthorized) {
            // Redirect to a safe dashboard if you don't have the required role
            return <Navigate to="/dashboard" replace />
        }
    }

    return <Outlet />
}
