import { AppSidebar } from "@/components/AppSidebar"
import { AppNavbar } from "@/components/AppNavbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Outlet } from "react-router-dom"
import { MenuProvider } from "@/context/menu"
import { PermissionsProvider } from "@/context/permissions"

export default function AppLayout({ children }: { children?: React.ReactNode }) {
    return (
        <TooltipProvider delay={0}>
            <SidebarProvider className="overflow-hidden h-svh">
                <PermissionsProvider>
                    <MenuProvider>
                        <AppSidebar />
                        <SidebarInset className="overscroll-none flex-1 overflow-hidden">
                            <AppNavbar />
                            <main className="flex flex-1 flex-col px-4 md:px-8 pb-8 pt-6 min-w-0 flex-grow bg-slate-50 overflow-y-auto">
                                <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500 min-h-full flex flex-col gap-6 min-w-0">
                                    {children || <Outlet />}
                                </div>
                            </main>
                        </SidebarInset>
                    </MenuProvider>
                </PermissionsProvider>
            </SidebarProvider>
        </TooltipProvider>
    )
}
