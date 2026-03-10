import { AppSidebar } from "@/components/AppSidebar"
import { AppNavbar } from "@/components/AppNavbar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet } from "react-router-dom"

export default function AppLayout({ children }: { children?: React.ReactNode }) {
    return (
        <TooltipProvider delay={0}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <AppNavbar />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 md:pt-6">
                        <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
                            {children || <Outlet />}
                        </div>
                    </main>
                    <footer className="border-t py-6 px-8 flex items-center justify-center text-[11px] font-medium text-muted-foreground bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5 opacity-70">
                            <span>&copy; 2026</span>
                            <span className="font-bold text-foreground/80">LichemIndo CRM.</span>
                            <span>All rights reserved.</span>
                        </div>
                    </footer>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
