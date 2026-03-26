import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { UsersDataTable } from "@/pages/module/config/users/data-table"
import { columns, type User } from "@/pages/module/config/users/columns"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { showToast } = useToast()
    const { hasPermission } = usePermissions()

    const loadUsers = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setUsers([])
            return
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const payload = await response.json().catch(() => null)
            throw new Error(payload?.message ?? "Failed to load users")
        }

        const usersData = (await response.json()) as User[]
        setUsers(usersData)
    }, [])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadUsers()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load users",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void run()
    }, [loadUsers, showToast])

    const canCreate = hasPermission("users-create")

    const headerControls = useMemo(
        () => (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                    <Search className="size-4 text-slate-400" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canCreate ? (
                    <Link
                        to="/users/create"
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                        )}
                    >
                        Create
                    </Link>
                ) : null}
            </div>
        ),
        [search, canCreate]
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading users...</p>
            ) : (
                <UsersDataTable
                    columns={columns}
                    data={users}
                    searchValue={search}
                    headerControls={headerControls}
                />
            )}
        </div>
    )
}
