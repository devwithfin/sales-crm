import AppRoutes from "@/routes/AppRoutes"
import { useSessionTimeout } from "@/hooks/useSessionTimeout"

function App() {
    useSessionTimeout()
    return <AppRoutes />
}

export default App
