import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { apiFetch } from "@/lib/api"

export type MenuNode = {
    id: string
    name: string
    level: number
    order: number
    icon: string | null
    link: string | null
    model: string | null
    permission: string | null
    children: MenuNode[]
}

type MenuContextValue = {
    menus: MenuNode[]
    isLoading: boolean
    refresh: () => Promise<void>
    fetchAllMenus: () => Promise<MenuNode[]>
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
    const [menus, setMenus] = useState<MenuNode[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchMenus = useCallback(async () => {
        const token = localStorage.getItem("token")

        if (!token) {
            setMenus([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const data = await apiFetch<MenuNode[]>("/menus")
            setMenus(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("[MenuContext] Failed to fetch menus", error)
            setMenus([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchAllMenus = useCallback(async (): Promise<MenuNode[]> => {
        try {
            const data = await apiFetch<MenuNode[]>("/menus/all")
            return Array.isArray(data) ? data : []
        } catch (error) {
            console.error("Failed to fetch all menus", error)
            return []
        }
    }, [])

    useEffect(() => {
        void fetchMenus()
    }, [fetchMenus])

    const value = useMemo(
        () => ({
            menus,
            isLoading,
            refresh: fetchMenus,
            fetchAllMenus,
        }),
        [menus, isLoading, fetchMenus, fetchAllMenus]
    )

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenuData() {
    const context = useContext(MenuContext)
    if (!context) {
        throw new Error("useMenuData must be used within a MenuProvider")
    }

    return context
}
