import {
    LayoutDashboard,
    BarChart3,
    Users,
    UserCircle,
    Handshake,
    MapPin,
    Package,
    FileText,
    ShoppingCart,
    ShieldAlert,
    UserCog,
    Building2,
    Menu as MenuIcon,
    type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
    "layout-dashboard": LayoutDashboard,
    layoutdashboard: LayoutDashboard,
    "bar-chart-3": BarChart3,
    barchart3: BarChart3,
    users: Users,
    "user-circle": UserCircle,
    usercircle: UserCircle,
    handshake: Handshake,
    "map-pin": MapPin,
    mappin: MapPin,
    package: Package,
    "file-text": FileText,
    filetext: FileText,
    "shopping-cart": ShoppingCart,
    shoppingcart: ShoppingCart,
    "shield-alert": ShieldAlert,
    shieldalert: ShieldAlert,
    "user-cog": UserCog,
    usercog: UserCog,
    "building-2": Building2,
    building2: Building2,
    menu: MenuIcon,
}

export function resolveMenuIcon(name?: string | null): LucideIcon {
    if (!name) {
        return LayoutDashboard
    }
    const key = name.toLowerCase()
    return ICON_MAP[key] ?? LayoutDashboard
}
