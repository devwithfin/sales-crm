import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./App.css"

import { BrowserRouter } from "react-router-dom"
import { ToastProvider } from "@/context/toast"
import { PermissionsProvider } from "@/context/permissions"
import { AuthProvider } from "@/context/auth"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <PermissionsProvider>
                        <App />
                    </PermissionsProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    </StrictMode>,
)
