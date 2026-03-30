import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

/**
 * User profile shape based on the backend response.
 */
export type UserProfile = {
    id: string
    email: string
    fullName: string
    department?: string
    status: string
    role: {
        id: string
        name: string
    }
}

type AuthContextValue = {
    user: UserProfile | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, userData: UserProfile) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * AuthProvider manages the global authentication state.
 * It reads from localStorage on mount and provides login/logout helpers.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // On mount, check if we have a persisted session
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Failed to parse stored user", error)
                // If data is corrupted, clear everything
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                localStorage.removeItem("loginTime")
            }
        }
        setIsLoading(false)
    }, [])

    /**
     * Updates state and localStorage after successful sign-in.
     */
    const login = (token: string, userData: UserProfile) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("loginTime", Date.now().toString())
        setUser(userData)
    }

    /**
     * Clears state and localStorage.
     */
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("loginTime")
        setUser(null)
    }

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Custom hook to access authentication state.
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
