import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./App.css"

import { BrowserRouter } from "react-router-dom"
import { ToastProvider } from "@/context/toast"
import { PermissionsProvider } from "@/context/permissions"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <PermissionsProvider>
                    <App />
                </PermissionsProvider>
            </ToastProvider>
        </BrowserRouter>
    </StrictMode>,
)
