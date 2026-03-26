import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { API_BASE_URL } from "@/constants/env"

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
            const response = await fetch(`${API_BASE_URL}/menus`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log("[MenuContext] Response status:", response.status)

            if (!response.ok) {
                throw new Error(`Failed to load menus: ${response.status}`)
            }

            const data = (await response.json()) as MenuNode[]
            console.log("[MenuContext] Got menus:", data.length)
            setMenus(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("[MenuContext] Failed to fetch menus", error)
            setMenus([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchAllMenus = useCallback(async (): Promise<MenuNode[]> => {
        const token = localStorage.getItem("token")

        if (!token) {
            return []
        }

        try {
            const response = await fetch(`${API_BASE_URL}/menus/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Failed to load all menus")
            }

            const data = (await response.json()) as MenuNode[]
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
