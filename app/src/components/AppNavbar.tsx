import { Bell, User, LogOut, Search } from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { API_BASE_URL } from "@/constants/env"
import { useCallback, useMemo } from "react"
import { useToast } from "@/context/toast"
import { useMenuData, type MenuNode } from "@/context/menu"

function flattenMenuNodes(menus: MenuNode[]) {
    const flattened: Array<{ title: string; url: string }> = []

    const traverse = (node: MenuNode) => {
        if (node.link) {
            flattened.push({ title: node.name, url: node.link })
        }

        node.children.forEach(traverse)
    }

    menus.forEach(traverse)

    return flattened.sort((a, b) => b.url.length - a.url.length)
}

export function AppNavbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { menus } = useMenuData()

    const menuItems = useMemo(() => flattenMenuNodes(menus), [menus])

    // Find the current menu item title based on the URL
    const currentMenuItem = menuItems.find(
        item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`)
    )

    const pageTitle = currentMenuItem ? currentMenuItem.title : "Dashboard"

    const handleSignOut = useCallback(async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            if (!response.ok) {
                throw new Error("Failed to sign out, please try again")
            }
            showToast({ type: "success", message: "You have been signed out" })
        } catch (error) {
            console.error("Failed to call logout endpoint", error)
            const message = error instanceof Error ? error.message : "Could not reach logout service"
            showToast({ type: "error", message })
        } finally {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login", { replace: true })
        }
    }, [navigate, showToast])

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white z-50 justify-between shadow-sm">
            <div className="flex items-center gap-2 md:px-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground/90">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 size-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search anything..."
                        className="pl-9 w-64 h-9 bg-muted/40 border-none rounded-full focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 transition-all font-medium"
                    />
                </div>

                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none shrink-0">
                    <Bell className="size-5" />
                    <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full border-2 border-background"></span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none border-none bg-transparent p-0 cursor-pointer group">
                        <Avatar className="size-9 border-2 border-muted group-hover:border-primary transition-all duration-300">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">LM</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 mt-2 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                        <Link to="/profile/my-account">
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                                <User className="size-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-900">My Account</span>
                            </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator className="my-1 border-t border-slate-100" />

                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors outline-none">
                            <LogOut className="size-4" />
                            <span className="text-sm font-bold">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
