import { useNavigate } from "react-router-dom"
import { ChevronLeft, Camera, Shield, User, Mail, Building2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MyAccountPage() {
    const navigate = useNavigate()

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
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Update Profile</Button>
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
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">BS</AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 size-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors">
                                    <Camera className="size-4 text-slate-600" />
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-slate-900">Budi Santoso</h2>
                                <p className="text-sm font-medium text-primary mt-1">Administrator</p>
                                <div className="flex items-center justify-center gap-2 mt-4 text-slate-500">
                                    <Mail className="size-3.5" />
                                    <span className="text-xs">budi@lichemindo.com</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 rounded-3xl shadow-sm">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Shield className="size-4 text-primary" /> Security Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">2FA Status</span>
                                <span className="font-bold text-emerald-600">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Last Login</span>
                                <span className="text-slate-700 font-medium">16 Mar 2026, 14:20</span>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl py-5 text-xs font-bold border-slate-200">Change Password</Button>
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
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="Budi Santoso" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="budi@lichemindo.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="+62 812 3456 7890" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="IT Administrator" />
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
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="IT Infrastructure" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="EMP-12345" readOnly />
                                </div>
                                <div className="lg:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin className="size-3" /> Office Location
                                    </label>
                                    <Input className="py-5 font-medium border-slate-200" defaultValue="Jakarta Head Office, Lantai 12" readOnly />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
