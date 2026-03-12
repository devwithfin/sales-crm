import { AppSidebar } from "@/components/AppSidebar"
import { AppNavbar } from "@/components/AppNavbar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet, useLocation } from "react-router-dom"

export default function AppLayout({ children }: { children?: React.ReactNode }) {
    const location = useLocation()
    return (
        <TooltipProvider delay={0}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="min-w-0 overflow-hidden flex flex-col h-screen">
                    <AppNavbar />
                    <main className="flex flex-1 flex-col px-4 md:px-8 pb-8 pt-6 min-w-0 flex-grow overflow-y-auto bg-slate-50">
                        <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500 min-h-full flex flex-col gap-6 min-w-0">
                            {children || <Outlet />}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
