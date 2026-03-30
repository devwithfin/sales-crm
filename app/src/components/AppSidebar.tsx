import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { COMPANY_LOGO_PATH } from "@/constants/branding"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, useSidebar } from "@/components/ui/sidebar"
import { useMenuData, type MenuNode } from "@/context/menu"
import { resolveMenuIcon } from "@/constants/menu-icons"

type SidebarNavItem = {
    id: string
    title: string
    url: string
    iconKey: string | null
}

type SidebarNavGroup = {
    id: string
    title: string
    items: SidebarNavItem[]
}

function buildSidebarGroups(nodes: MenuNode[]): SidebarNavGroup[] {
    return nodes
        .map(node => {
            const itemsSource = node.children.length > 0 ? node.children : [node]
            const items: SidebarNavItem[] = itemsSource
                .filter(child => Boolean(child.link))
                .map(child => ({
                    id: child.id,
                    title: child.name,
                    url: child.link ?? "#",
                    iconKey: child.icon ?? node.icon ?? null,
                }))

            return {
                id: node.id,
                title: node.name,
                items,
            }
        })
        .filter((group): group is SidebarNavGroup => Boolean(group))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, toggleSidebar } = useSidebar()
    const location = useLocation()
    const { menus, isLoading } = useMenuData()

    const groups = React.useMemo(() => buildSidebarGroups(menus), [menus])

    return (
        <Sidebar variant="sidebar" collapsible="icon" {...props} className="border-r z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
            <SidebarHeader className={`border-b h-16 flex flex-row items-center transition-all duration-300 ${state === "collapsed" ? "justify-center px-0" : "justify-between px-4"}`}>
                <div
                    className={`flex items-center cursor-pointer min-w-0 ${state === "collapsed" ? "justify-center" : "gap-3"}`}
                    onClick={state === "collapsed" ? toggleSidebar : undefined}>
                    <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white text-primary-foreground shadow-md shrink-0 p-1.5">
                        <img src={COMPANY_LOGO_PATH} alt="Licentra logo" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none whitespace-nowrap overflow-hidden transition-all duration-300 group-data-[state=collapsed]:hidden text-left">
                        <span className="font-bold text-base tracking-tight text-white">Licentra</span>
                    </div>
                </div>

                {state === "expanded" && (
                    <button
                        onClick={toggleSidebar}
                        className="flex size-9 items-center justify-center rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all shrink-0 ml-auto"
                        title="Collapse Sidebar">
                        <PanelLeft className="size-5" />
                    </button>
                )}
            </SidebarHeader>

            <SidebarContent className="!overflow-y-auto !overflow-x-hidden no-scrollbar h-full pt-6 pb-10 gap-0">
                {isLoading ? (
                    <div className="px-6 text-sm text-white/60">Loading menus...</div>
                ) : groups.length === 0 ? (
                    <div className="px-6 text-sm text-white/60">No menus available</div>
                ) : (
                    groups.map(group => (
                        <SidebarGroup key={group.id} className={`px-0 ${state === "collapsed" ? "py-0" : "py-2"}`}>
                            <SidebarGroupLabel className={`px-6 text-sm font-extrabold tracking-[0.02em] text-white/70 mb-0 ${state === "collapsed" ? "hidden" : "block"}`}>{group.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className={state === "collapsed" ? "gap-0" : "gap-1"}>
                                    {group.items.map(item => {
                                        const isActive = location.pathname === item.url
                                        const Icon = resolveMenuIcon(item.iconKey)

                                        return (
                                            <SidebarMenuItem key={item.id}>
                                                <SidebarMenuButton tooltip={item.title} isActive={isActive} className="p-0 h-auto overflow-visible group-data-[collapsible=icon]:w-[5.5rem]! group-data-[collapsible=icon]:h-16! group-data-[collapsible=icon]:p-0!">
                                                    <Link
                                                        to={item.url}
                                                        className={`flex transition-all w-full font-medium relative group ${state === "collapsed" ? "flex-col items-center justify-center py-2 h-16 px-0 gap-1" : "flex-row items-center px-6 py-2.5 gap-3"} ${
                                                            isActive && state === "expanded"
                                                                ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                                                                : isActive && state === "collapsed"
                                                                  ? "text-white bg-transparent"
                                                                  : "text-white/60 hover:bg-white/10 hover:text-white"
                                                        }`}>
                                                        {isActive && state === "expanded" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10" />}

                                                        <Icon className={`shrink-0 transition-transform duration-300 ${state === "collapsed" ? "size-7" : "size-5"}`} />

                                                        <span className={`tracking-wide transition-all duration-300 ${state === "collapsed" ? "text-[10px] font-bold text-center leading-tight px-1" : "text-sm block"}`}>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                )}
            </SidebarContent>
        </Sidebar>
    )
}
