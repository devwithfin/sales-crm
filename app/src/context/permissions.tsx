import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { API_BASE_URL } from "@/constants/env"

type PermissionRecord = {
    id: string
    name: string
    assigned: boolean
}

type PermissionContextValue = {
    permissions: Set<string>
    isLoading: boolean
    refresh: () => Promise<void>
    hasPermission: (permission: string) => boolean
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

function getCurrentRoleId() {
    if (typeof window === "undefined") {
        return null
    }

    const rawUser = localStorage.getItem("user")
    if (!rawUser) {
        return null
    }

    try {
        const parsed = JSON.parse(rawUser) as { role?: { id?: string } }
        return parsed.role?.id ?? null
    } catch {
        return null
    }
}

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const [permissionNames, setPermissionNames] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPermissions = useCallback(async () => {
        const token = localStorage.getItem("token")
        const roleId = getCurrentRoleId()

        if (!token || !roleId) {
            setPermissionNames([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${roleId}/permissions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Failed to load permissions")
            }

            const data = (await response.json()) as PermissionRecord[]
            const assigned = data.filter(permission => permission.assigned).map(permission => permission.name)
            setPermissionNames(assigned)
        } catch (error) {
            console.error("Failed to fetch permissions", error)
            setPermissionNames([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void fetchPermissions()
    }, [fetchPermissions])

    const permissionsSet = useMemo(() => new Set(permissionNames), [permissionNames])

    const value = useMemo(
        () => ({
            permissions: permissionsSet,
            isLoading,
            refresh: fetchPermissions,
            hasPermission: (permission: string) => permissionsSet.has(permission),
        }),
        [permissionsSet, isLoading, fetchPermissions]
    )

    return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}

export function usePermissions() {
    const context = useContext(PermissionContext)
    if (!context) {
        throw new Error("usePermissions must be used within a PermissionsProvider")
    }
    return context
}
