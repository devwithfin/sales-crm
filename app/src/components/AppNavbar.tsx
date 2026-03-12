import { Bell, User, LogOut, Search } from "lucide-react"
import { useLocation } from "react-router-dom"
import { menuData } from "@/constants/menuData"
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

export function AppNavbar() {
    const location = useLocation()

    // Find the current menu item title based on the URL
    const currentMenuItem = menuData
        .flatMap(group => group.items)
        .sort((a, b) => b.url.length - a.url.length)
        .find(item => location.pathname === item.url || location.pathname.startsWith(`${item.url}/`))

    const pageTitle = currentMenuItem ? currentMenuItem.title : "Dashboard"

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
                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                            <User className="size-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">My Account</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 border-t border-slate-100" />

                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors outline-none">
                            <LogOut className="size-4" />
                            <span className="text-sm font-bold">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
