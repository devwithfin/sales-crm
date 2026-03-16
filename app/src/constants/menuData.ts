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
} from "lucide-react"

export interface NavItem {
    title: string;
    url: string;
    icon: React.ElementType;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const menuData: NavGroup[] = [
    {
        title: "General",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            { title: "Reports", url: "/reports", icon: BarChart3 },
        ],
    },
    {
        title: "Sales",
        items: [
            { title: "Leads", url: "/leads", icon: Users },
            { title: "Contacts", url: "/contacts", icon: UserCircle },
            { title: "Accounts", url: "/accounts", icon: Building2 },
            { title: "Visits", url: "/visits", icon: MapPin },
            { title: "Deals", url: "/deals", icon: Handshake },
        ],
    },
    {
        title: "Transactions",
        items: [
            { title: "Products", url: "/products", icon: Package },
            { title: "Quotes", url: "/quotes", icon: FileText },
            { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
        ],
    },
    {
        title: "Config",
        items: [
            { title: "Role", url: "/roles", icon: ShieldAlert },
            { title: "User", url: "/users", icon: UserCog },
        ],
    },
]
