import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"

type LogoutOptions = {
    successMessage?: string
    showSuccessToast?: boolean
    showErrorToast?: boolean
}

const DEFAULT_SUCCESS_MESSAGE = "You have been signed out"

export function useLogout() {
    const navigate = useNavigate()
    const { showToast } = useToast()

    return useCallback(
        async ({
            successMessage = DEFAULT_SUCCESS_MESSAGE,
            showSuccessToast = true,
            showErrorToast = true,
        }: LogoutOptions = {}) => {
            const token = localStorage.getItem("token")

            try {
                if (token) {
                    const response = await fetch(`${API_BASE_URL}/logout`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    if (!response.ok) {
                        throw new Error("Failed to sign out, please try again")
                    }
                }

                if (showSuccessToast) {
                    showToast({ type: "success", message: successMessage })
                }
            } catch (error) {
                console.error("Failed to call logout endpoint", error)

                if (showErrorToast) {
                    const message = error instanceof Error ? error.message : "Could not reach logout service"
                    showToast({ type: "error", message })
                }
            } finally {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                navigate("/login", { replace: true })
            }
        },
        [navigate, showToast],
    )
}
