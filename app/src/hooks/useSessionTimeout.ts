import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/context/toast"

// Session timeout in milliseconds (30 minutes = 30 * 60 * 1000)
const SESSION_TIMEOUT = 30 * 60 * 1000

export function useSessionTimeout() {
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        const checkSession = () => {
            const loginTime = localStorage.getItem("loginTime")
            const token = localStorage.getItem("token")

            if (!token || !loginTime) {
                return
            }

            const elapsed = Date.now() - parseInt(loginTime, 10)

            if (elapsed >= SESSION_TIMEOUT) {
                // Clear session data
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                localStorage.removeItem("loginTime")

                // Show toast and redirect
                showToast({
                    type: "error",
                    message: "Session expired. Please login again.",
                })
                navigate("/login", { replace: true })
            }
        }

        // Check on mount
        checkSession()

        // Check every minute
        const interval = setInterval(checkSession, 60 * 1000)

        return () => clearInterval(interval)
    }, [navigate, showToast])
}