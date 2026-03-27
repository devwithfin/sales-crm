import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ChevronLeft, Camera, User, Mail, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserData {
    id: string
    fullName: string
    email: string
    department?: string
    status?: string
    roleId?: string
    role?: {
        name: string
    }
    createdAt?: string
    updatedAt?: string
}

export default function MyAccountPage() {
    const navigate = useNavigate()
    
    // Get user data from localStorage directly (no useEffect needed for synchronous localStorage)
    const [userData] = useState<UserData | null>(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                return JSON.parse(storedUser)
            } catch (e) {
                console.error("Failed to parse user data", e)
            }
        }
        return null
    })

    // Generate initials for avatar
    const initials = userData?.fullName 
        ? userData.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U"

    return (
        <div className="flex flex-col pb-10">
            {/* Header */}
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(-1)}
                        className="rounded-lg"
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Account</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-6">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5 w-full" />
                        <CardContent className="relative pt-0 flex flex-col items-center">
                            <div className="relative -mt-12 group">
                                <Avatar className="size-24 border-4 border-white shadow-xl ring-1 ring-slate-100">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 size-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors">
                                    <Camera className="size-4 text-slate-600" />
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-slate-900">{userData?.fullName || "User"}</h2>
                                <p className="text-sm font-medium text-primary mt-1">{userData?.role?.name || "User"}</p>
                                <div className="flex items-center justify-center gap-2 mt-4 text-slate-500">
                                    <Mail className="size-3.5" />
                                    <span className="text-xs">{userData?.email || "email@example.com"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Details Card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 rounded-3xl shadow-sm">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <User className="size-5 text-primary" /> Personalized Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue={userData?.fullName || ""} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue={userData?.email || ""} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 rounded-3xl shadow-sm">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="size-5 text-primary" /> Corporate Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue={userData?.department || ""} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue={userData?.status || "Active"} readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
